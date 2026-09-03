import { createClient } from '@supabase/supabase-js'
import { rateLimit, clientIp } from '@/lib/rateLimit'
import { logInfo, logError } from '@/lib/structuredLog'
import { getWarDay } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// ── OilpriceAPI: commodities (no rate limit) ────────────────────────────────
async function fetchOilpricePrice(code) {
  try {
    const r = await fetch(
      `https://api.oilpriceapi.com/v1/prices/latest?code=${code}`,
      {
        headers: { Authorization: `Bearer ${process.env.OILPRICE_KEY}` },
        signal: AbortSignal.timeout(15000),
      }
    ).then((res) => res.json())
    const p = r?.data?.price
    const ch = r?.data?.changes?.['24h']
    if (typeof p !== 'number') return null
    return {
      price: p.toFixed(2),
      change: (ch?.amount ?? 0).toFixed(2),
      change_pct: (ch?.percent ?? 0).toFixed(2),
      unit: 'USD',
    }
  } catch {
    return null
  }
}

const OILPRICE_CODES = {
  brent: 'BRENT_CRUDE_USD',
  wti: 'WTI_CRUDE_USD',
  natural_gas: 'NATURAL_GAS_USD',
  heating_oil: 'HEATING_OIL_USD',
  rbo_gasoline: 'GASOLINE_USD',
  gold: 'GOLD_USD',
  copper: 'COPPER_USD',
  silver: 'SILVER_USD',
  platinum: 'PLATINUM_USD',
  uranium: 'URANIUM_USD',
}

// ── Yahoo Finance: commodities via futures (free, no key) ───────────────────
const YAHOO_COMMODITY_SYMBOLS = {
  brent: 'BZ=F',
  wti: 'CL=F',
  natural_gas: 'NG=F',
  heating_oil: 'HO=F',
  rbo_gasoline: 'RB=F',
  gold: 'GC=F',
  copper: 'HG=F',
  silver: 'SI=F',
  platinum: 'PL=F',
  uranium: 'UROY',
}

// ── Yahoo Finance: stock indices (free, no key) ─────────────────────────────
// Map the page's symbol keys → Yahoo ticker symbols
const YAHOO_SYMBOLS = {
  'SENSEX.XBOM': '^BSESN',
  'NSEI.XNSE': '^NSEI',
  'SPY': 'SPY',
  'DIA': 'DIA',
  'UKX.XLON': '^FTSE',
  'DAX.XETR': '^GDAXI',
  'N225.XTKS': '^N225',
  'HSI.XHKG': '^HSI',
  'KS11.XKRX': '^KS11',
  'TWII.XTAI': '^TWII',
  'SSEC.XSHG': '000001.SS',
  'FCHI.XPAR': '^FCHI',
  'BVSP.XBSP': '^BVSP',
  'AXJO.XASX': '^AXJO',
  'GSPTSE.XTOR': '^GSPTSE',
  'MXX.XMEX': '^MXX',
  'AEX.XAMS': '^AEX',
  'IBEX.XMAD': '^IBEX',
}

// Generic Yahoo Finance daily price fetch (used for indices AND futures)
async function fetchYahooPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=1d&range=5d`
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(15000),
    })
    const d = await r.json()
    const res = d?.chart?.result?.[0]
    if (!res) return null
    const closes = (res.indicators?.quote?.[0]?.close || []).filter((v) => v != null)
    const dates = res.timestamp || []
    if (closes.length < 1) return null
    const last = closes[closes.length - 1]
    const prev = closes.length >= 2 ? closes[closes.length - 2] : last
    const pct = prev ? ((last - prev) / prev) * 100 : 0
    const date = dates[closes.length - 1]
      ? new Date(dates[closes.length - 1] * 1000).toISOString()
      : null
    return {
      symbol,
      open: last,
      close: last,
      change_pct: pct,
      date,
      series: closes.map((c, i) => ({
        value: c,
        date: dates[i] ? new Date(dates[i] * 1000).toISOString().slice(0, 10) : null,
      })),
    }
  } catch {
    return null
  }
}

// ── Alpha Vantage fallback for commodities (rate-limited, sparingly) ────────
function extractAVSeries(data) {
  const series = data?.data
  if (!Array.isArray(series) || series.length < 2) return null
  const latest = series[0]
  const prev = series[1]
  const price = parseFloat(latest.value)
  const prevPrice = parseFloat(prev?.value || price)
  if (isNaN(price) || isNaN(prevPrice)) return null
  const change = price - prevPrice
  return {
    price: price.toFixed(2),
    change: change.toFixed(2),
    change_pct: ((change / prevPrice) * 100).toFixed(2),
    unit: 'USD',
  }
}

function extractGlobalQuote(data) {
  const q = data?.['Global Quote']
  if (!q || !q['05. price']) return null
  const price = parseFloat(q['05. price'])
  const change = parseFloat(q['09. change'] || '0')
  if (isNaN(price)) return null
  return {
    price: price.toFixed(2),
    change: change.toFixed(2),
    change_pct: (q['10. change percent'] || '0%').replace('%', '').trim(),
    unit: 'USD',
  }
}

export async function GET(request) {
  const rl = rateLimit(clientIp(request), 20, 60000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Too many requests. Please wait before refreshing again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === 'true'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // ── READ EXISTING CACHE (never null-out good data) ────────────────────────
  let prevCache = null
  const { data: cacheRow } = await supabase
    .from('market_cache')
    .select('data, updated_at')
    .eq('id', 'main')
    .single()
  if (cacheRow?.data) {
    prevCache = cacheRow.data
    if (!force && cacheRow.updated_at) {
      const cacheAge = (Date.now() - new Date(cacheRow.updated_at).getTime()) / 60000
      if (cacheAge < 30) {
        return Response.json({
          ...cacheRow.data,
          from_cache: true,
          cache_age_minutes: Math.round(cacheAge),
        })
      }
    }
  }

  // ── COMMODITIES: Yahoo futures first, OilpriceAPI, then AV fallback ───────
  const AV_KEY = process.env.ALPHAVANTAGE_KEY
  const AV_FALLBACK = {
    brent: async () =>
      fetch(`https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${AV_KEY}`)
        .then((r) => r.json())
        .then(extractAVSeries),
    wti: async () =>
      fetch(`https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${AV_KEY}`)
        .then((r) => r.json())
        .then(extractAVSeries),
    natural_gas: async () =>
      fetch(`https://www.alphavantage.co/query?function=NATURAL_GAS&interval=daily&apikey=${AV_KEY}`)
        .then((r) => r.json())
        .then(extractAVSeries),
    gold: async () =>
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${AV_KEY}`)
        .then((r) => r.json())
        .then(extractGlobalQuote),
    copper: async () =>
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=CPER&apikey=${AV_KEY}`)
        .then((r) => r.json())
        .then(extractGlobalQuote),
  }

  const commodities = {}

  // 1) Yahoo futures — primary, free, no key
  const yahooCommodityResults = await Promise.all(
    Object.entries(YAHOO_COMMODITY_SYMBOLS).map(async ([key, ticker]) => ({
      key,
      row: await fetchYahooPrice(ticker),
    }))
  )
  const yahooCommodity = {}
  for (const { key, row } of yahooCommodityResults) {
    if (row) {
      const prev = row.series?.length >= 2 ? row.series[row.series.length - 2].value : null
      const pct = prev ? ((row.close - prev) / prev) * 100 : 0
      yahooCommodity[key] = {
        price: row.close.toFixed(2),
        change: (row.close - (prev || row.close)).toFixed(2),
        change_pct: pct.toFixed(2),
        unit: 'USD',
      }
    }
  }

  // 2) Fill any gaps with OilpriceAPI, then Alpha Vantage
  for (const key of Object.keys(OILPRICE_CODES)) {
    let value = yahooCommodity[key]
    if (!value) value = await fetchOilpricePrice(OILPRICE_CODES[key])
    if (!value && AV_KEY) {
      try {
        value = await AV_FALLBACK[key]()
      } catch {}
      await new Promise((r) => setTimeout(r, 400))
    }
    commodities[key] = value || prevCache?.commodities?.[key] || null
  }

  const oil = {
    brent: commodities.brent,
    wti: commodities.wti,
    natural_gas: commodities.natural_gas,
    heating_oil: commodities.heating_oil,
    rbo_gasoline: commodities.rbo_gasoline,
  }
  const commodityGroup = {
    gold: commodities.gold,
    silver: commodities.silver,
    platinum: commodities.platinum,
    copper: commodities.copper,
    uranium: commodities.uranium,
  }

  // ── STOCK MARKETS: Yahoo Finance (all indices, free) ─────────────────────
  let markets = []
  const yahooResults = await Promise.all(
    Object.entries(YAHOO_SYMBOLS).map(async ([pageKey, ticker]) => ({
      pageKey,
      row: await fetchYahooPrice(ticker),
    }))
  )
  for (const { pageKey, row } of yahooResults) {
    if (row) markets.push({ ...row, symbol: pageKey })
  }
  // Fallback to previous markets if Yahoo returned nothing
  if (markets.length === 0 && Array.isArray(prevCache?.markets)) {
    markets = prevCache.markets
  }

  // ── FOREX (ExchangeRate-API, no rate limit) ───────────────────────────────
  let forex = prevCache?.forex || {}
  try {
    const pairs = [
      'INR', 'PKR', 'ILS', 'TRY', 'EGP', 'JPY', 'CHF', 'SAR',
      'EUR', 'GBP', 'CNY', 'AUD', 'CAD', 'SGD', 'HKD', 'KRW',
      'AED', 'QAR', 'KWD', 'OMR', 'BHD', 'RUB', 'ZAR', 'MXN',
      'THB', 'IDR', 'VND', 'PHP', 'BDT', 'LKR', 'NGN', 'KES',
      'BRL', 'CLP', 'COP', 'ARS', 'PLN', 'CZK', 'HUF', 'SEK',
      'NOK', 'DKK', 'NZD', 'TWD', 'NPR',
    ]
    const results = await Promise.all(
      pairs.map((to) =>
        fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_KEY}/pair/USD/${to}`
        )
          .then((r) => r.json())
          .catch(() => null)
      )
    )
    pairs.forEach((to, i) => {
      if (results[i]?.conversion_rate) {
        const rate = results[i].conversion_rate
        const prevRate = forex[`USD/${to}`]?.rate
        const change_pct = prevRate ? ((rate - prevRate) / prevRate) * 100 : null
        forex[`USD/${to}`] = {
          rate,
          pair: `USD/${to}`,
          change_pct,
        }
      }
    })
  } catch {}

  const warDay = getWarDay()

  // ── PRICE HISTORY (snapshots appended on every run, capped at 48 = 24h) ──
  const HISTORY_MAX = 48
  let history = Array.isArray(prevCache?.history) ? prevCache.history.slice() : []

  // Seed stock-market history on first run from Yahoo's 5-day series
  if (history.length === 0) {
    const seed = []
    for (const m of markets) {
      if (Array.isArray(m.series)) {
        m.series.forEach((p) => {
          if (p.value != null) {
            seed.push({ ts: p.date ? `${p.date}T12:00:00Z` : new Date().toISOString(), [m.symbol]: p.value })
          }
        })
      }
    }
    history = seed.sort((a, b) => new Date(a.ts) - new Date(b.ts))
  }

  // Append today's full snapshot (all commodities + markets + forex)
  const snapshot = { ts: new Date().toISOString() }
  for (const [k, v] of Object.entries(commodities)) {
    if (v?.price != null) snapshot[k] = parseFloat(v.price)
  }
  for (const m of markets) {
    if (m?.close != null) snapshot[m.symbol] = parseFloat(m.close)
  }
  for (const [pair, v] of Object.entries(forex)) {
    if (v?.rate != null) snapshot[pair] = parseFloat(v.rate)
  }
  history = [...history, snapshot].slice(-HISTORY_MAX)

  const freshData = {
    oil,
    commodities: commodityGroup,
    forex,
    markets,
    history,
    war_day: warDay,
    last_updated: new Date().toISOString(),
    from_cache: false,
  }

  const sourceCounts = {
    commodities: Object.values(commodities || {}).filter((v) => v?.price != null).length,
    markets: (markets || []).filter((m) => m?.close != null).length,
    forex: Object.values(forex || {}).filter((v) => v?.rate != null).length,
  }
  const missing = []
  if (sourceCounts.commodities < 5) missing.push('oilprice/alphavantage')
  if (sourceCounts.markets < 5) missing.push('yahoo-markets')
  if (sourceCounts.forex < 20) missing.push('exchangerate')

  await supabase
    .from('market_cache')
    .upsert({ id: 'main', data: freshData, updated_at: new Date().toISOString() })

  if (missing.length) {
    logError('live-markets', 'partial_data', new Error(`sources degraded: ${missing.join(', ')}`), {
      sourceCounts,
    })
  } else {
    logInfo('live-markets', 'complete', { ...sourceCounts, from_cache: false })
  }

  return Response.json(freshData)
}
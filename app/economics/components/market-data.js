import { Droplet, Flame, Home, Fuel, Gem, Coins, CircleDollarSign, Cog, Atom } from 'lucide-react'

export const ECO_CATEGORIES = [
  'All',
  'Energy Markets',
  'Global Economy',
  'Emerging Markets',
  'Sanctions',
  'Trade',
  'Currency',
]

export const COMMODITY_ITEMS = [
  { key: 'brent',       src: 'oil',         subKey: 'brent',       icon: <Droplet size={15} />,  label: 'Brent Crude',  unit: '/barrel', note: 'Key Middle East export benchmark' },
  { key: 'wti',         src: 'oil',         subKey: 'wti',         icon: <Droplet size={15} />,  label: 'WTI Crude',    unit: '/barrel', note: 'US oil price reference' },
  { key: 'natural_gas', src: 'oil',         subKey: 'natural_gas', icon: <Flame size={15} />,   label: 'Natural Gas',  unit: '/MMBtu',  note: 'Europe LNG dependency indicator' },
  { key: 'heating_oil', src: 'oil',         subKey: 'heating_oil', icon: <Home size={15} />,    label: 'Heating Oil',  unit: '/gallon', note: 'Winter fuel & diesel proxy' },
  { key: 'rbo_gasoline',src: 'oil',         subKey: 'rbo_gasoline',icon: <Fuel size={15} />,    label: 'RBOB Gasoline', unit: '/gallon', note: 'Retail fuel & transport stress' },
  { key: 'gold',        src: 'commodities', subKey: 'gold',        icon: <Gem size={15} />,     label: 'Gold',         unit: '/oz',     note: 'War safe-haven — surging on conflict' },
  { key: 'silver',      src: 'commodities', subKey: 'silver',      icon: <Coins size={15} />,   label: 'Silver',       unit: '/oz',     note: 'Industrial + safe-haven metal' },
  { key: 'platinum',    src: 'commodities', subKey: 'platinum',    icon: <CircleDollarSign size={15} />, label: 'Platinum', unit: '/oz', note: 'Auto-catalyst & industrial demand' },
  { key: 'copper',      src: 'commodities', subKey: 'copper',      icon: <Cog size={15} />,     label: 'Copper',       unit: '/lb',     note: 'War industry & infrastructure proxy' },
  { key: 'uranium',     src: 'commodities', subKey: 'uranium',     icon: <Atom size={15} />,    label: 'Uranium',      unit: '/lb',     note: 'Nuclear energy & fuel-security play' },
]

export const MARKET_SYMBOLS = {
  'SENSEX.XBOM': { name: 'BSE Sensex',   flag: '🇮🇳', region: 'Asia-Pacific' },
  'NSEI.XNSE':   { name: 'Nifty 50',     flag: '🇮🇳', region: 'Asia-Pacific' },
  'N225.XTKS':   { name: 'Nikkei 225',   flag: '🇯🇵', region: 'Asia-Pacific' },
  'HSI.XHKG':    { name: 'Hang Seng',    flag: '🇭🇰', region: 'Asia-Pacific' },
  'KS11.XKRX':   { name: 'KOSPI',        flag: '🇰🇷', region: 'Asia-Pacific' },
  'TWII.XTAI':   { name: 'Taiwan Taiex', flag: '🇹🇼', region: 'Asia-Pacific' },
  'SSEC.XSHG':   { name: 'Shanghai',     flag: '🇨🇳', region: 'Asia-Pacific' },
  'AXJO.XASX':   { name: 'ASX 200',      flag: '🇦🇺', region: 'Asia-Pacific' },
  'UKX.XLON':    { name: 'FTSE 100',     flag: '🇬🇧', region: 'Europe' },
  'DAX.XETR':    { name: 'DAX',          flag: '🇩🇪', region: 'Europe' },
  'FCHI.XPAR':   { name: 'CAC 40',       flag: '🇫🇷', region: 'Europe' },
  'AEX.XAMS':    { name: 'AEX',          flag: '🇳🇱', region: 'Europe' },
  'IBEX.XMAD':   { name: 'IBEX 35',      flag: '🇪🇸', region: 'Europe' },
  'SPY':         { name: 'S&P 500',      flag: '🇺🇸', region: 'Americas' },
  'DIA':         { name: 'Dow Jones',    flag: '🇺🇸', region: 'Americas' },
  'GSPTSE.XTOR': { name: 'S&P/TSX',      flag: '🇨🇦', region: 'Americas' },
  'BVSP.XBSP':   { name: 'Bovespa',      flag: '🇧🇷', region: 'Americas' },
  'MXX.XMEX':    { name: 'IPC Mexico',   flag: '🇲🇽', region: 'Americas' },
}
export const MARKET_REGIONS = ['Asia-Pacific', 'Europe', 'Americas']

export const PRESSURE_CURRENCIES = [
  { pair: 'USD/INR', flag: '🇮🇳', symbol: '₹', note: 'Oil import stress; INR at record low' },
  { pair: 'USD/PKR', flag: '🇵🇰', symbol: '₨', note: 'Fuel crisis — 18-day reserve' },
  { pair: 'USD/ILS', flag: '🇮🇱', symbol: '₪', note: 'War economy — shekel under pressure' },
  { pair: 'USD/TRY', flag: '🇹🇷', symbol: '₺', note: 'Geopolitical risk spillover' },
  { pair: 'USD/EGP', flag: '🇪🇬', symbol: '£', note: 'Suez Canal revenues down 60%' },
  { pair: 'USD/ZAR', flag: '🇿🇦', symbol: 'R', note: 'EM risk aversion; rand sensitive to oil' },
  { pair: 'USD/BDT', flag: '🇧🇩', symbol: '৳', note: 'Fuel import bill squeezes reserves' },
  { pair: 'USD/LKR', flag: '🇱🇰', symbol: 'Rs', note: 'Post-crisis economy, war trade shock' },
  { pair: 'USD/NPR', flag: '🇳🇵', symbol: 'रू', note: 'Remittance & fuel dependency' },
  { pair: 'USD/NGN', flag: '🇳🇬', symbol: '₦', note: 'Oil exporter, high fuel import cost' },
  { pair: 'USD/KES', flag: '🇰🇪', symbol: 'KSh', note: 'Food + fuel import stress' },
]
export const SAFEHAVEN_CURRENCIES = [
  { pair: 'USD/JPY', flag: '🇯🇵', symbol: '¥', note: 'Traditional safe haven rising' },
  { pair: 'USD/CHF', flag: '🇨🇭', symbol: 'Fr', note: 'Swiss franc — classic safe haven' },
  { pair: 'USD/SAR', flag: '🇸🇦', symbol: 'SR', note: 'Oil revenue beneficiary' },
  { pair: 'USD/KWD', flag: '🇰🇼', symbol: 'د.ك', note: 'Gulf petrocurrency; strong peg' },
]
export const GLOBAL_MAJOR_CURRENCIES = [
  { pair: 'USD/EUR', flag: '🇪🇺', symbol: '€', note: 'Euro — EU sanctions bloc pressure' },
  { pair: 'USD/GBP', flag: '🇬🇧', symbol: '£', note: 'Pound — energy import exposure' },
  { pair: 'USD/CNY', flag: '🇨🇳', symbol: '¥', note: 'Yuan — China hedging war trade' },
  { pair: 'USD/AUD', flag: '🇦🇺', symbol: 'A$', note: 'Aussie — commodity-linked currency' },
  { pair: 'USD/CAD', flag: '🇨🇦', symbol: 'C$', note: 'Loonie — oil exporter beneficiary' },
  { pair: 'USD/SGD', flag: '🇸🇬', symbol: 'S$', note: 'Sing dollar — Gulf shipping exposure' },
  { pair: 'USD/NZD', flag: '🇳🇿', symbol: 'NZ$', note: 'Kiwi — agri + commodity-linked' },
  { pair: 'USD/SEK', flag: '🇸🇪', symbol: 'kr', note: 'Krona — EU trade exposure' },
  { pair: 'USD/NOK', flag: '🇳🇴', symbol: 'kr', note: 'Krone — oil exporter benefit' },
  { pair: 'USD/DKK', flag: '🇩🇰', symbol: 'kr', note: 'Krone — pegged to euro bloc' },
  { pair: 'USD/PLN', flag: '🇵🇱', symbol: 'zł', note: 'Zloty — Eastern Europe war risk' },
  { pair: 'USD/CZK', flag: '🇨🇿', symbol: 'Kč', note: 'Koruna — CEE manufacturing hub' },
  { pair: 'USD/HUF', flag: '🇭🇺', symbol: 'Ft', note: 'Forint — high energy import bill' },
]
export const GULF_REGION_CURRENCIES = [
  { pair: 'USD/AED', flag: '🇦🇪', symbol: 'د.إ', note: 'Dirham — Gulf financial hub' },
  { pair: 'USD/QAR', flag: '🇶🇦', symbol: 'ر.ق', note: 'Qatari riyal — LNG export boom' },
  { pair: 'USD/OMR', flag: '🇴🇲', symbol: 'ر.ع', note: 'Rial — stable Gulf peg' },
  { pair: 'USD/BHD', flag: '🇧🇭', symbol: 'د.ب', note: 'Dinar — Bahrain financial center' },
  { pair: 'USD/HKD', flag: '🇭🇰', symbol: 'HK$', note: 'HK dollar — Asian financial hub' },
  { pair: 'USD/KRW', flag: '🇰🇷', symbol: '₩', note: 'Won — export-driven, EM risk' },
  { pair: 'USD/TWD', flag: '🇹🇼', symbol: 'NT$', note: 'Taiwan dollar — tech supply chains' },
  { pair: 'USD/THB', flag: '🇹🇭', symbol: '฿', note: 'Baht — tourism + energy import' },
  { pair: 'USD/IDR', flag: '🇮🇩', symbol: 'Rp', note: 'Rupiah — oil import stress' },
  { pair: 'USD/VND', flag: '🇻🇳', symbol: '₫', note: 'Dong — manufacturing war hedge' },
  { pair: 'USD/PHP', flag: '🇵🇭', symbol: '₱', note: 'Peso — fuel + food import' },
]
export const FRONTIER_CURRENCIES = [
  { pair: 'USD/RUB', flag: '🇷🇺', symbol: '₽', note: 'Rouble — Russia hedging, war trade' },
  { pair: 'USD/MXN', flag: '🇲🇽', symbol: '$', note: 'Peso — commodity-linked EM' },
  { pair: 'USD/BRL', flag: '🇧🇷', symbol: 'R$', note: 'Real — EM commodity exposure' },
  { pair: 'USD/CLP', flag: '🇨🇱', symbol: '$', note: 'Peso — copper export boom' },
  { pair: 'USD/COP', flag: '🇨🇴', symbol: '$', note: 'Peso — oil & EM risk' },
  { pair: 'USD/ARS', flag: '🇦🇷', symbol: '$', note: 'Peso — high inflation, war import' },
]

export const ALL_CURRENCY_ITEMS = [
  ...PRESSURE_CURRENCIES,
  ...SAFEHAVEN_CURRENCIES,
  ...GLOBAL_MAJOR_CURRENCIES,
  ...GULF_REGION_CURRENCIES,
  ...FRONTIER_CURRENCIES,
]

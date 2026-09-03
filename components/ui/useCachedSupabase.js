'use client'

import { useState, useEffect, useCallback } from 'react'

// Stale-while-revalidate for Supabase queries:
// - Shows localStorage-cached rows instantly on mount (no empty flash)
// - Fetches fresh data in the background, updates cache + state
// - Falls back to cache silently on network failure
export function useCachedSupabase(cacheKey, fetcher, { refreshMs = 300000 } = {}) {
  const [rows, setRows] = useState(() => {
    try {
      if (typeof window === 'undefined') return []
      const raw = window.localStorage.getItem(cacheKey)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(rows.length === 0)
  const [loadError, setLoadError] = useState(false)

  const load = useCallback(async () => {
    setLoadError(false)
    try {
      const fresh = await fetcher()
      const list = Array.isArray(fresh) ? fresh : []
      setRows(list)
      try {
        window.localStorage.setItem(cacheKey, JSON.stringify(list.slice(0, 200)))
      } catch {}
    } catch {
      // Keep stale cache visible; only flag error when nothing to show
      setRows((prev) => {
        if (prev.length === 0) setLoadError(true)
        return prev
      })
    } finally {
      setLoading(false)
    }
  }, [cacheKey, fetcher])

  useEffect(() => {
    load()
    if (!refreshMs) return
    const iv = setInterval(load, refreshMs)
    return () => clearInterval(iv)
  }, [load, refreshMs])

  return { rows, loading, loadError, reload: load, setRows }
}

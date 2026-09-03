// Shared war constants — single source of truth.
// WAR_START = Feb 28, 2026 (Day 1). War day = floor((now - WAR_START) / 86400000) + 1.
export const WAR_START = new Date('2026-02-28T00:00:00Z')
export const WAR_START_ISO = '2026-02-28'

export function getWarDay(date = new Date()) {
  const d = Math.floor((date - WAR_START) / 86400000) + 1
  return d > 0 ? d : 1
}

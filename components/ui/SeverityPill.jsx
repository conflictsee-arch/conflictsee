import Pill from '@/components/ui/Pill'

export default function SeverityPill({ severity }) {
  const s = (severity || 'medium').toString().toLowerCase()
  const map = {
    high:   { bg: '#FEF2F2', color: '#DC2626' },
    medium: { bg: '#FFFBEB', color: '#D97706' },
    low:    { bg: '#F0FDF4', color: '#16A34A' },
  }
  const st = map[s] || map.medium
  return <Pill label={s.charAt(0).toUpperCase() + s.slice(1)} {...st} />
}
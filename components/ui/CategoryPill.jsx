import Pill from '@/components/ui/Pill'

// Shared category-pill with a per-page color map. Pass the category string
// and the section's color map; falls back to a neutral grey.
export default function CategoryPill({ category, map }) {
  const key = (category || '').toString().toLowerCase().trim()
  const st = map?.[key] || { bg: '#F3F4F6', color: '#374151' }
  return <Pill label={category || 'General'} {...st} />
}
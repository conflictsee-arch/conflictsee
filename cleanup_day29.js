const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanup() {
  console.log('🧹 Cleaning up Day 29+ events...')
  
  // Delete events where day_number in description is > 28
  // AND is_locked is false (to protect historical data)
  const { data, error } = await supabase
    .from('events')
    .delete()
    .filter('is_locked', 'eq', false)
    .or('description->>day_number.gt.28')
    .select()

  if (error) {
    console.error('Error deleting events:', error)
  } else {
    console.log(`✅ Deleted ${data?.length || 0} future-dated events.`)
    
    // Verify
    const { data: maxDay } = await supabase
      .rpc('get_max_day') // Fallback if RPC exists or use a raw query
      .catch(() => ({ data: null }))
      
    const { data: latest } = await supabase
      .from('events')
      .select('description')
      .order('id', { ascending: false })
      .limit(100)
    
    let max = 0
    latest?.forEach(e => {
      try {
        const d = JSON.parse(e.description).day_number
        if (d > max) max = d
      } catch {}
    })
    
    console.log('Current MAX Day in DB:', max)
  }
}

cleanup()

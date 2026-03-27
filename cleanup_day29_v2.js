const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manual env parsing
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanup() {
  console.log('🧹 Cleaning up Day 29+ events...')
  
  // Use filter because .delete() with jsonb arrows is tricky in old JS clients
  // but let's try standard JS filter approach:
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('is_locked', false)
    .filter('description->>day_number', 'gt', 28)
    .select()

  if (error) {
    console.error('Error deleting events:', error)
  } else {
    console.log(`✅ Deleted ${data?.length || 0} future-dated events.`)
    
    const { data: latest } = await supabase
      .from('events')
      .select('description')
      .order('id', { ascending: false })
      .limit(200)
    
    let max = 0
    latest?.forEach(e => {
      try {
        const desc = typeof e.description === 'string' ? JSON.parse(e.description) : e.description
        const d = desc.day_number
        if (d > max) max = d
      } catch (err) {
        // quiet fail for legacy formats
      }
    })
    
    console.log('Current MAX Day in DB:', max)
  }
}

cleanup()

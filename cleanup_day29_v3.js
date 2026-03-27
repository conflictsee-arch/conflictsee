const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8')
const env = {}
envFile.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).forEach(line => {
  const parts = line.split('=')
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim()
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data, error } = await supabase
    .from('events')
    .select('id, description')
    .order('id', { ascending: false })
    .limit(200)

  if (error) {
    console.error(error)
    return
  }

  const futureIds = []
  data.forEach(e => {
    try {
      const desc = typeof e.description === 'string' ? JSON.parse(e.description) : e.description
      if (desc.day_number > 28) {
        console.log(`[DAY ${desc.day_number}] ID: ${e.id}`)
        futureIds.push(e.id)
      }
    } catch {}
  })

  if (futureIds.length > 0) {
    console.log(`Found ${futureIds.length} future events. Deleting...`)
    const { error: delErr } = await supabase
      .from('events')
      .delete()
      .in('id', futureIds)
    
    if (delErr) console.error(delErr)
    else console.log('✅ Deleted successfully.')
  } else {
    console.log('No future events found.')
  }
}

check()

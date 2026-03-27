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
    .select('*')
    .order('id', { ascending: false })
    .limit(10)

  if (error || !data.length) {
    console.log('No events found.')
    return
  }

  data.forEach((e, i) => {
    console.log(`--- EVENT ${i} ---`)
    console.log('ID:', e.id)
    console.log('Title:', e.title)
    console.log('Verified:', e.verified)
    console.log('Category:', e.category)
    console.log('Description:', e.description?.slice(0, 100))
  })
}

check()

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
    .eq('verified', false)
    .order('id', { ascending: false })
    .limit(1)

  if (error || !data.length) {
    console.log('No AI events found.')
    return
  }

  const desc = typeof data[0].description === 'string' ? JSON.parse(data[0].description) : data[0].description
  console.log('--- LATEST AI EVENT ---')
  console.log('Title:', data[0].title)
  console.log('Category:', data[0].category)
  console.log('Date:', desc.date)
  console.log('Bullets:', JSON.stringify(desc.bullets, null, 2))
}

check()

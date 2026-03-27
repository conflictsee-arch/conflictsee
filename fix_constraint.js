const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { error: dropError } = await supabase.rpc('query', {
    query_text: `ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;`
  })
  if (dropError) console.error('Drop error:', dropError)

  const { error: addError } = await supabase.rpc('query', {
    query_text: `ALTER TABLE events ADD CONSTRAINT events_category_check CHECK (category IN (
      'military', 'Military',
      'diplomatic', 'Diplomatic',
      'economic', 'Economic',
      'humanitarian', 'Humanitarian',
      'political', 'Political',
      'nuclear', 'Nuclear',
      'intelligence', 'Intelligence',
      'news', 'News'
    ));`
  })
  if (addError) console.error('Add error:', addError)
  console.log('Constraint updated.')
}
run()

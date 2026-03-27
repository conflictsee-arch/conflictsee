import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fxswdclbsngtydrcemeq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4c3dkY2xic25ndHlkcmNlbWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgzNDA0MiwiZXhwIjoyMDg5NDEwMDQyfQ.h6c-rq8OkXiL8v0qSgoGHqSvcGWnl0GM6E9ieAQey5U'
)

async function insertEvents() {
  const { error } = await supabase.from('events').insert([
    {
      title: 'Iran Uses Cluster Munitions on Israel — IDF: Significant Escalation',
      description: JSON.stringify({
        date: '2026-03-18',
        time: '07:00',
        day_number: 19,
        context_header: 'New weapons escalation — cluster munitions deployed against Israeli areas',
        bullets: [
          { summary: 'Iran fires cluster munitions — first confirmed use against Israeli civilians', detail: 'Israeli officials confirm Iran has begun using cluster munitions in missile barrages targeting central and southern Israel. IDF: The use of cluster munitions is a significant escalation raising serious concerns over civilian impact.' },
          { summary: 'Lebanon death toll hits 900 — 1 million displaced', detail: 'Lebanon Health Ministry confirms 900+ killed since Day 3. 1 million Lebanese displaced — roughly 1 in 5 of the entire population. Lebanese PM Aoun formally appeals to Trump for ceasefire.' }
        ]
      }),
      category: 'Military',
      severity: 'High',
      source: 'IDF / Al Arabiya',
      verified: true,
      is_locked: true,
      published_at: '2026-03-18T07:00:00Z'
    },
    {
      title: 'South Pars Gas Field Struck — World\'s Largest Gas Reservoir Hit',
      description: JSON.stringify({
        date: '2026-03-18',
        time: '02:30',
        day_number: 19,
        context_header: 'Energy war reaches most severe phase — Iran\'s main gas field targeted',
        bullets: [
          { summary: 'Israeli airstrikes hit South Pars — world\'s largest natural gas reservoir', detail: 'Israeli Air Force strikes South Pars gas field in Assaluyeh. Gas refineries struck. Iranian media confirms halted production at South Pars Phases 14, 17, and 21. Qatar immediately protests calling it a threat to shared regional energy infrastructure.' },
          { summary: 'Bandar Abbas port and oil terminal struck simultaneously', detail: 'Simultaneous strikes hit naval zones near Shahid Rajaee Port in Bandar Abbas. Oil terminal handling 800,000 bpd of crude oil loading also targeted. Iran announces halt of all oil loading operations from Bandar Abbas.' }
        ]
      }),
      category: 'Economic',
      severity: 'High',
      source: 'Reuters / Mehr News',
      verified: true,
      is_locked: true,
      published_at: '2026-03-18T02:30:00Z'
    }
  ])
  
  if (error) console.error(error)
  else console.log('Successfully inserted Day 19 events')
  
  const { data } = await supabase.from('events').select('description, verified')
  const counts = {}
  data.forEach(e => {
    if (!e.verified) return
    let payload = {}
    try { payload = JSON.parse(e.description) } catch(err) {}
    const day = payload.day_number
    counts[day] = (counts[day] || 0) + 1
  })
  
  Object.keys(counts).sort((a,b)=>a-b).forEach(day => {
    console.log(`Day ${day}: ${counts[day]} events`)
  })
}

insertEvents()

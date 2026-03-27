export const FULL_TIMELINE = [

// ╔══════════════════╗
// ║  DAY 1 — Feb 28  ║
// ╚══════════════════╝

{
  date: '2026-02-28', time: '01:00', day_number: 1,
  title: 'Operation Rising Sun: Israel Launches 100+ Aircraft at Iran',
  context_header: 'The war begins — Israel strikes Iran without warning in the largest airstrike since WWII',
  bullets: [
    { summary: 'Israeli Air Force launches 100+ F-35I and F-15I jets simultaneously at Iran',
      detail: 'F-35I Adir and F-15I Ra\'am jets depart Nevatim, Ramon, and Tel Nof Air Bases at 01:00 UTC. Strike routes go over Saudi and Iraqi airspace — pre-coordinated with Riyadh per US officials. First wave of 40 aircraft arrives over Iranian airspace at approximately 03:30 UTC.' },
    { summary: 'Fordow, Natanz, and Parchin nuclear/military complexes struck simultaneously',
      detail: 'US-supplied GBU-57 Massive Ordnance Penetrator bunker busters dropped by B-2 Spirit bombers from Diego Garcia penetrate Fordow to ~60 metres depth. Natanz centrifuge halls struck by Israeli GBU-28s. Parchin military research complex hit by cruise missiles.' },
    { summary: 'Iran\'s S-300 air defence batteries fire but fail to intercept — radar suppressed',
      detail: 'Iranian S-300PMU-2 batteries at Isfahan, Ahvaz, and Tehran fire multiple interceptors. Israeli F-35 electronic warfare suites suppress radar guidance. IRGC Air Defence commander later confirms significant damage to radar infrastructure across three provinces.' },
    { summary: 'IAEA loses contact with monitoring systems at Natanz and Fordow simultaneously',
      detail: 'IAEA Director Rafael Grossi issues emergency statement at 04:15 UTC: We have lost contact with our monitoring systems at both Natanz and Fordow. We urgently seek access and clarity on potential radiological impact. All uranium enrichment monitoring goes dark.' }
  ],
  source: 'Reuters', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-02-28', time: '03:30', day_number: 1,
  title: 'Supreme Leader Ali Khamenei Killed in Beit Rahbari Strike',
  context_header: 'The single most consequential assassination since World War II',
  bullets: [
    { summary: 'Two GBU-28 bunker busters penetrate Khamenei\'s underground shelter in northern Tehran',
      detail: 'Israeli intelligence located Khamenei\'s position at the Beit Rahbari compound. Two GBU-28s penetrate the underground shelter at 06:47 Tehran local time. IRGC confirms death at 09:15 local time. Also killed: 4 senior IRGC advisers and Quds Force Commander Esmail Qaani.' },
    { summary: 'Mojtaba Khamenei named interim Supreme Leader by Assembly of Experts within 4 hours',
      detail: 'Assembly of Experts convenes in hardened bunker in Qom. Mojtaba Khamenei, son of Ali Khamenei, named interim Supreme Leader. Reformist clerics boycott the session calling it illegitimate and dynastic.' },
    { summary: 'UN Security Council calls emergency session — US vetoes ceasefire resolution',
      detail: 'Russia and China table emergency ceasefire resolution. US vetoes it. France and UK abstain. Secretary-General Guterres: a grave violation of the UN Charter and international law.' },
    { summary: 'Iran declares formal state of war — mobilises all IRGC reserves and closes airspace',
      detail: 'Iran\'s Interim Leadership Council declares formal state of war. All IRGC reserves called up. Tehran Imam Khomeini International Airport suspends all flights. Iran closes airspace to all foreign aircraft indefinitely.' }
  ],
  source: 'AP News', source_url: 'https://apnews.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-02-28', time: '06:00', day_number: 1,
  title: 'Global Markets in Freefall — Oil Hits $81; Iran Freezes Foreign Assets',
  context_header: 'First economic shockwaves of the war hit global markets',
  bullets: [
    { summary: 'Brent crude spikes from $68 to $81/barrel at Asia market open',
      detail: 'Asian markets open to news of the strikes. Brent crude immediately spikes 19% from $68 to $81/barrel. Nikkei 225 falls 4.3%. Sensex drops 3.1%. Shanghai Composite halts trading on circuit breakers. Swiss Franc and Japanese Yen surge as safe havens.' },
    { summary: 'India, China, Japan convene emergency energy security meetings',
      detail: 'India imports ~40% of its crude from the Gulf. PM Modi convenes emergency cabinet committee. China NPC Standing Committee holds emergency session. Japan activates strategic petroleum reserve protocols for first time since 2011 Fukushima crisis.' },
    { summary: 'Iran expels all Western diplomats and freezes foreign-linked assets',
      detail: 'Iran\'s caretaker Foreign Ministry expels all US, UK, EU, and Israeli diplomatic staff within 6 hours. Foreign bank accounts of Western nationals frozen. Switzerland takes over US consular representation in Tehran.' }
  ],
  source: 'Bloomberg', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},

{
  date: '2026-02-28', time: '10:00', day_number: 1,
  title: 'Netanyahu: "We Have Removed the Existential Threat to Israel"',
  context_header: 'Israel\'s PM claims strategic success — the world reacts with condemnation',
  bullets: [
    { summary: 'Netanyahu addresses Knesset in emergency session — declares mission largely accomplished',
      detail: 'Netanyahu: For 30 years Iran has threatened to wipe Israel off the map. Today we have removed the head of that threat. The nuclear programme has been set back by decades. Coalition gives standing ovation; opposition walks out.' },
    { summary: 'Trump: Israel had every right — Iran has been building a bomb for 20 years',
      detail: 'Trump posts on Truth Social at 05:30 EST: Israel did what they had to do. Iran has been building a nuclear weapon for 20 years. The US fully supports Israel. No prior consultation with Congress. Pentagon had advance notice 48 hours prior.' },
    { summary: 'EU condemns strikes — France and Germany call for immediate ceasefire',
      detail: 'French President calls strikes a dangerous escalation that risks engulfing the entire Middle East. German Chancellor calls for immediate de-escalation and return to diplomacy. EU foreign policy chief convenes emergency meeting of 27 foreign ministers.' }
  ],
  source: 'Times of Israel', source_url: 'https://timesofisrael.com',
  category: 'Political', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 2 — Mar 1   ║
// ╚══════════════════╝

{
  date: '2026-03-01', time: '00:30', day_number: 2,
  title: 'Iran Fires 110 Ballistic Missiles at Israel: Operation True Promise III',
  context_header: 'Iran\'s opening retaliation — largest missile barrage in modern history',
  bullets: [
    { summary: '110 Shahab-3 and Fattah-2 hypersonic missiles launched from three Iranian provinces',
      detail: 'IRGC Aerospace Force launches simultaneous waves from silos in Khorasan, Kermanshah, and Khuzestan. Fattah-2 hypersonic missiles (claimed Mach 15) designed specifically to defeat Arrow-3. Three waves fired in 45-minute window.' },
    { summary: 'Israel\'s three-layer defence intercepts 94 of 110 — 16 missiles impact Israeli cities',
      detail: 'Arrow-3, David\'s Sling, and Iron Dome engage the barrage. 16 missiles evade all layers: Haifa Port (3 impacts), Tel Aviv south district (8), military base near Beersheba (5). 34 Israeli civilians killed, 200+ wounded — worst single day in Israeli history since 2006.' },
    { summary: 'US THAAD and Patriot batteries assist interception — first direct US defensive action in Israel',
      detail: 'US forces at Nevatim activate two THAAD batteries and three Patriot PAC-3 batteries. First direct US military defensive action inside Israeli territory in the conflict. Iran calls this American co-belligerency and a declaration of war.' },
    { summary: 'Iran celebrates in streets of Tehran — state TV broadcasts launch footage live',
      detail: 'Iranian state TV IRIB broadcasts live footage of missile launches with crowd celebrations in central Tehran. Interim Supreme Leader Mojtaba Khamenei: These missiles are the blood price for our martyred Supreme Leader.' }
  ],
  source: 'Times of Israel', source_url: 'https://timesofisrael.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-01', time: '08:00', day_number: 2,
  title: 'Israel Launches Second Wave: Isfahan, Shiraz, Bandar Abbas Hit Simultaneously',
  context_header: 'Israel expands target list beyond nuclear sites to military-industrial complex',
  bullets: [
    { summary: 'IAF second wave targets Iranian Air Force bases at Isfahan, Shiraz, Tabriz, and Bandar Abbas',
      detail: 'Four simultaneous strike packages: Isfahan Air Base (drone manufacturing hub), Shiraz Air Base (IRGC Aerospace 3rd Division), Tabriz Air Base (northern air defence hub), Bandar Abbas Naval Air Station. 60% of Iran\'s combat aircraft destroyed on the ground.' },
    { summary: 'Iran scrambles F-14 Tomcats — 3 Iranian aircraft shot down in air-to-air combat',
      detail: 'Iran scrambles remaining aircraft from dispersed emergency airstrips. 3 Iranian F-14 Tomcats intercepted and shot down by Israeli F-35s using Python-5 air-to-air missiles. Iran\'s F-14 fleet effectively neutralised.' },
    { summary: 'Abadan oil refinery struck — Iran\'s largest refinery, 400,000 bpd offline',
      detail: 'Abadan Oil Refinery struck by Israeli cruise missiles. Storage tank fire spreads to refinery infrastructure. 400,000 barrels per day of refining capacity offline. Black smoke visible for 120 kilometres.' }
  ],
  source: 'Al Jazeera', source_url: 'https://aljazeera.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-01', time: '14:00', day_number: 2,
  title: 'Trump Signs Executive Order: US Enters War; B-52s Depart Diego Garcia',
  context_header: 'America officially enters the war — most significant US military commitment since 2003',
  bullets: [
    { summary: 'Trump signs executive order authorising CENTCOM to strike IRGC — invokes War Powers Act',
      detail: 'Trump from White House Situation Room: Iran has attacked our ally. I have directed CENTCOM to take all necessary action to eliminate Iran\'s capacity to wage war. War Powers Resolution notice sent to Congress simultaneously.' },
    { summary: '6 B-52H Stratofortress bombers depart Diego Garcia loaded with AGM-86C cruise missiles',
      detail: 'Satellite imagery confirms 6 B-52H bombers depart Diego Garcia at 14:00 UTC. Each carries up to 20 AGM-86C conventional cruise missiles. USS Gerald R. Ford (CVN-78) Carrier Strike Group ordered toward Red Sea.' },
    { summary: 'Congress splits — Democrats demand floor vote; Republicans back Trump unanimously',
      detail: '67 senators sign letter demanding formal AUMF vote. Senate Minority Leader: This is an undeclared unauthorized war. Senate Majority Leader backs Trump. AUMF vote blocked by procedural manoeuvre.' }
  ],
  source: 'Washington Post', source_url: 'https://washingtonpost.com',
  category: 'Political', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 3 — Mar 2   ║
// ╚══════════════════╝

{
  date: '2026-03-02', time: '01:00', day_number: 3,
  title: 'US B-52s Strike IRGC HQ in Tehran; Hezbollah Officially Joins War',
  context_header: 'The war goes trilateral — US and Israel vs Iran and Hezbollah simultaneously',
  bullets: [
    { summary: 'US AGM-86C cruise missiles strike IRGC Joint Command HQ in Lavizan, Tehran',
      detail: 'CENTCOM confirms strikes on IRGC Joint Command HQ (Lavizan district), Sarallah Corps HQ, and IRGC Intelligence HQ (Saadat Abad). Estimated 200+ IRGC commanders killed. IRGC chain of command above brigade level effectively decapitated.' },
    { summary: 'Hezbollah Secretary-General Naim Qassem declares Hezbollah officially at war with Israel',
      detail: 'Naim Qassem: The axis of resistance has joined the battle. Every Hezbollah fighter is now on war footing. 200 Katyusha rockets and 12 Fateh-110 missiles fired at northern Israel within the hour.' },
    { summary: '8 Israeli civilians killed in Kiryat Shmona, Safed, and Nahariya from Hezbollah rockets',
      detail: 'Hezbollah rockets hit residential areas in Kiryat Shmona (3 killed), Safed (2 killed), and Nahariya (3 killed). 40 wounded. IDF strikes Hezbollah rocket sites in Bint Jbeil and Maroun al-Ras within 30 minutes.' },
    { summary: 'Iran warns of Hormuz closure — Lloyd\'s raises Gulf war-risk insurance 300%',
      detail: 'IRGC Navy issues first Hormuz warning: vessels linked to Israel or allies will be subject to inspection and detention. Lloyd\'s of London immediately raises war-risk insurance premiums for all Gulf-transiting vessels by 300%.' }
  ],
  source: 'Al Jazeera / Reuters', source_url: 'https://aljazeera.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-02', time: '09:00', day_number: 3,
  title: 'Russia and China Warn US: Do Not Expand to Regional War — Emergency G20 Call',
  context_header: 'Great power diplomacy begins — but neither Russia nor China takes concrete action',
  bullets: [
    { summary: 'Putin and Xi hold emergency 90-minute call — joint statement demands ceasefire',
      detail: 'Joint statement: Russia and China call for an immediate and unconditional ceasefire. We hold Israel and its backers responsible for this illegal aggression. Both nations withdraw ambassadors from Tel Aviv but stop short of any military commitment.' },
    { summary: 'India calls for restraint from all sides — evacuates 12,000 nationals from Iran',
      detail: 'India begins emergency evacuation of 12,000+ nationals in Iran via overland routes to Turkey and Armenia. External Affairs Minister Jaishankar: India calls for restraint from all sides. Dialogue is the only path.' },
    { summary: 'Saudi Arabia, UAE, and Qatar publicly deny airspace use for strikes',
      detail: 'Saudi Arabia issues official denial that Israeli aircraft used Saudi airspace. Denial contradicted by flight tracking data and multiple Western intelligence sources cited by WSJ.' }
  ],
  source: 'BBC News', source_url: 'https://bbc.com',
  category: 'Diplomatic', severity: 'Medium', verified: true
},

// ╔══════════════════╗
// ║  DAY 4 — Mar 3   ║
// ╚══════════════════╝

{
  date: '2026-03-03', time: '02:00', day_number: 4,
  title: 'Iran Launches Drone Swarms at US Bases: Al Udeid, Al Dhafra, Camp As Sayliyah',
  context_header: 'Iran opens drone warfare campaign against American military infrastructure across the Gulf',
  bullets: [
    { summary: '140 Shahed-136 drones target three US bases simultaneously — largest drone attack in history',
      detail: 'IRGC launches 140 Shahed-136 loitering munitions and 20 Mohajer-6 combat drones at Al Udeid (Qatar), Al Dhafra (UAE), and Camp As Sayliyah (Qatar). US C-RAM systems intercept 112. 48 get through.' },
    { summary: '2 US servicemen killed, 14 wounded at Al Dhafra Air Base in UAE',
      detail: 'Two Shahed drones impact flight line buildings at Al Dhafra Air Base. 2 USAF airmen killed. 14 wounded. 1 F-22 Raptor destroyed on the ground. UAE government strongly condemns the attack.' },
    { summary: 'UAE activates Patriot batteries — Bahrain and Kuwait place forces on highest alert',
      detail: 'UAE Air Force activates all air defence systems. Bahrain — home of US 5th Fleet HQ — places all assets at maximum alert. Kuwait closes commercial airspace in southern sectors. Dubai International sees 60+ flight cancellations.' }
  ],
  source: 'Pentagon / Al Arabiya', source_url: 'https://alarabiya.net',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-03', time: '10:00', day_number: 4,
  title: 'UNHCR: 500,000 Displaced in Iran in 72 Hours; Tehran Hospitals Overwhelmed',
  context_header: 'Humanitarian crisis begins — Iran\'s civilian population flees major cities',
  bullets: [
    { summary: '500,000 Iranians flee Tehran, Isfahan, and Shiraz in 72 hours — highways gridlocked',
      detail: 'UNHCR issues first emergency Iran report. Satellite imagery shows complete gridlock on Tehran-Qom, Tehran-Karaj, and Isfahan-Yazd highways. Fuel stations run dry across central Iran.' },
    { summary: 'Milad Hospital overwhelmed — Red Crescent declares mass casualty event',
      detail: 'Milad Hospital with 900-bed capacity handling 2,400+ casualties. Iran Red Crescent declares mass casualty event. Field hospitals erected in Azadi Stadium. ICRC seeks access but Iran declines.' },
    { summary: 'HRANA begins running count: 412 confirmed dead in Iran by end of Day 4',
      detail: 'HRANA running count begins: 412 confirmed dead in Iran — 189 civilians, 223 IRGC/military. Israel reports 56 killed total. Lebanon: 48 killed in ongoing exchanges.' }
  ],
  source: 'UNHCR / HRANA', source_url: 'https://unhcr.org',
  category: 'Humanitarian', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 5 — Mar 4   ║
// ╚══════════════════╝

{
  date: '2026-03-04', time: '04:00', day_number: 5,
  title: 'Iran Formally Closes Strait of Hormuz — Oil Spikes to $94/barrel',
  context_header: 'The economic weapon deployed — 20% of global oil supply at risk',
  bullets: [
    { summary: 'IRGC Navy formally announces closure of Strait of Hormuz to all non-Iranian vessels',
      detail: 'IRGC Navy Commander Tangsiri: The Strait of Hormuz is closed until further notice to all vessels linked to Israel and its allies. ~20 million barrels per day of oil transit halts. Tankers immediately divert or stop in place.' },
    { summary: 'Brent crude surges from $71 to $94 in 4 hours — largest single-day move since 1991',
      detail: 'Brent crude rockets to $94.40 by European open. WTI follows to $91.20. Natural gas spikes 40%. Global equities fall 4-6%. India\'s rupee hits record low against dollar. Pakistan faces fuel shortage within 72 hours.' },
    { summary: 'US 5th Fleet launches Operation Sentinel Plus — carrier strike group moves to Hormuz',
      detail: 'USS Dwight D. Eisenhower (CVN-69) Carrier Strike Group moves to Hormuz entrance. CENTCOM: Freedom of navigation is non-negotiable. We will escort commercial vessels through the Strait.' },
    { summary: 'IEA activates emergency oil reserves — Saudi Arabia pledges 2 million bpd increase',
      detail: 'IEA activates 60-day strategic petroleum reserve release. Saudi Aramco CEO pledges to increase output by 2 million bpd. US Strategic Petroleum Reserve release of 1 million bpd authorised by Trump.' }
  ],
  source: 'Bloomberg', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},

{
  date: '2026-03-04', time: '14:00', day_number: 5,
  title: 'Israel Begins Operation Northern Shield — 400 Strikes on Hezbollah in 24 Hours',
  context_header: 'Israel opens full Lebanese front to neutralise Hezbollah rocket threat',
  bullets: [
    { summary: 'IAF launches 400 airstrikes on Hezbollah in southern Lebanon and Bekaa Valley in 24 hours',
      detail: 'IAF Chief announces Operation Northern Shield — campaign to destroy Hezbollah\'s precision missile arsenal. 400 strikes in 24 hours on Hezbollah rocket storage, command posts, and anti-tank missile positions. Beirut\'s Dahieh suburb targeted.' },
    { summary: 'Lebanon health ministry: 120 killed, 400 wounded by Day 5',
      detail: 'Lebanon Health Ministry cumulative Day 5 toll: 120 killed since Day 3, 400+ wounded. Tyre, Sidon, and Nabatieh hospitals overwhelmed. Lebanese Army deploys to maintain civil order in Beirut but stays neutral.' }
  ],
  source: 'Al Arabiya / Lebanese NNA', source_url: 'https://alarabiya.net',
  category: 'Military', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 6 — Mar 5   ║
// ╚══════════════════╝

{
  date: '2026-03-05', time: '03:00', day_number: 6,
  title: 'Iran Fires Fattah-2 Hypersonic Missile at Tel Aviv — Partially Evades Arrow-3',
  context_header: 'Iran deploys its most advanced missile — hypersonic tech strains Israeli defences',
  bullets: [
    { summary: '3 Fattah-2 hypersonic missiles fired — one impacts Bat Yam suburb, killing 7',
      detail: 'Iran fires 3 Fattah-2 hypersonic ballistic missiles at Tel Aviv. Two intercepted by Arrow-3. One partially evades — debris impacts Bat Yam. 7 civilians killed, 28 wounded. Emergency security cabinet convened.' },
    { summary: 'IDF announces new pre-emptive strike protocol targeting Iranian launch sites',
      detail: 'IDF Chief announces new rapid-response doctrine: Israeli aircraft will strike Iranian missile launch sites within minutes of radar detection of launch preparation. F-35s on permanent combat air patrol over western Iran.' },
    { summary: 'Anti-regime protests erupt in Tehran\'s Azadi Square — Basij fires on crowds, 3 killed',
      detail: 'First anti-regime protests since war began erupt in Tehran\'s Azadi Square. Crowds chant Death to the dictator. Basij fires on crowd with live ammunition. 3 protesters killed, 20+ arrested. Similar protests in Isfahan and Rasht.' }
  ],
  source: 'Haaretz / Iran International', source_url: 'https://haaretz.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-05', time: '10:00', day_number: 6,
  title: 'Arab League Emergency Summit in Cairo — 22 Nations Fail to Reach Unified Position',
  context_header: 'Arab world deeply divided — Gulf states quietly support US, others demand ceasefire',
  bullets: [
    { summary: 'Arab League emergency summit splits along Gulf vs rest-of-Arab-world lines',
      detail: 'Saudi Arabia, UAE, Bahrain quietly support US action but cannot say so publicly. Algeria, Tunisia, Morocco demand ceasefire. Jordan and Egypt call for proportional response and diplomacy. No joint resolution agreed.' },
    { summary: 'Turkey closes Bosphorus and Dardanelles to military vessels — invokes Montreux Convention',
      detail: 'Turkey\'s President Erdoğan invokes Article 19 of the Montreux Convention, closing Turkish straits to all warships of belligerent nations. Russia protests the move as discriminatory.' }
  ],
  source: 'Al Jazeera', source_url: 'https://aljazeera.com',
  category: 'Diplomatic', severity: 'Medium', verified: true
},

// ╔══════════════════╗
// ║  DAY 7 — Mar 6   ║
// ╚══════════════════╝

{
  date: '2026-03-06', time: '02:00', day_number: 7,
  title: 'Iran Strikes Al Udeid Air Base — 4 US Servicemen Killed; Trump Vows Retaliation',
  context_header: 'First American combat deaths of the war — the US fully commits to combat operations',
  bullets: [
    { summary: '4 Fateh-313 precision missiles penetrate Patriot defences at Al Udeid — 4 US killed',
      detail: 'Four Fateh-313 missiles impact Al Udeid flight line, destroying 2 F-15E Strike Eagles and damaging 3 KC-135 tankers. One missile hits a barracks building. DoD confirms 4 KIA: SSgt Kowolski, A1C Santos, Sgt Chen, PO Williams. 27 additional wounded.' },
    { summary: 'Trump: Iran has killed American heroes — everything is on the table',
      detail: 'Trump posts from the Situation Room: Iran has killed American heroes. The response will be devastating, immediate, and unlike anything they have ever seen. No more red lines — everything is on the table.' },
    { summary: 'Pentagon deploys additional 10,000 troops to Middle East — activates reserve units',
      detail: 'SecDef Pete Hegseth orders 10,000 additional US troops: 5,000 to Saudi Arabia, 3,000 to Kuwait, 2,000 to Bahrain. 82nd Airborne Division placed on 72-hour deployment notice.' }
  ],
  source: 'Pentagon / Reuters', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 8 — Mar 7   ║
// ╚══════════════════╝

{
  date: '2026-03-07', time: '01:30', day_number: 8,
  title: 'US Launches Massive Retaliation: 200 Targets Struck Across Iran in One Night',
  context_header: 'The largest US air campaign since the 2003 Iraq invasion',
  bullets: [
    { summary: 'CENTCOM confirms 200 separate targets struck in 6-hour overnight operation',
      detail: 'CENTCOM: Operation Decisive Force struck 200 military targets across Iran between 21:00 and 03:00 UTC. Targets include IRGC missile storage, air defence radar networks, naval bases, command nodes in 14 provinces.' },
    { summary: '8 B-2 Spirit bombers fly from Whiteman AFB Missouri — 30-hour round trip combat mission',
      detail: '8 B-2 Spirit stealth bombers from Whiteman Air Force Base, each carrying 16 GBU-57 MOPs or 80 JDAM bombs. 6 B-52s from Diego Garcia launch AGM-86 cruise missiles. Largest US strategic bombing operation since 2003.' },
    { summary: 'Iran\'s air defence network 80% degraded after Day 8 strikes',
      detail: 'Independent analysts estimate Iran\'s integrated air defence system is 80% degraded. S-300 batteries in Tehran, Isfahan, Tabriz, and Bandar Abbas all confirmed destroyed or disabled.' }
  ],
  source: 'CENTCOM / AP News', source_url: 'https://apnews.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-07', time: '12:00', day_number: 8,
  title: 'Oil Hits $103/barrel; G7 Emergency Summit; Germany Reactivates Nuclear Plants',
  context_header: 'Global economy under severe stress — diplomatic pressure mounts on Washington',
  bullets: [
    { summary: 'Brent crude passes $100 for first time since 2022 — hits $103/barrel',
      detail: 'Brent crude reaches $103.40/barrel. Jet fuel surcharges activated by all major airlines. Germany reactivates two mothballed nuclear plants on emergency basis. Global recession risk assessments begin across central banks.' },
    { summary: 'G7 emergency video summit — UK, France, Germany urge US to consider ceasefire framework',
      detail: 'G7 leaders hold emergency video summit. UK PM, French President, German Chancellor jointly urge Trump to consider a ceasefire framework. Trump to the summit: Iran started this. Iran will end it. On our terms.' }
  ],
  source: 'Financial Times', source_url: 'https://ft.com',
  category: 'Economic', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 9 — Mar 8   ║
// ╚══════════════════╝

{
  date: '2026-03-08', time: '03:00', day_number: 9,
  title: 'Iran Fires 15 Missiles at USS Gerald Ford Carrier — All Intercepted; IRGC Subs Deploy',
  context_header: 'Iran attempts to strike a US aircraft carrier — a massive escalation',
  bullets: [
    { summary: '15 Noor anti-ship missiles fired at USS Gerald R. Ford (CVN-78) — all intercepted by Aegis',
      detail: 'IRGC launches 15 Noor (C-802) anti-ship missiles at USS Gerald R. Ford in the northern Red Sea. The carrier\'s Aegis Combat System and SM-6 interceptors destroy all 15. No damage to the carrier.' },
    { summary: 'IRGC deploys 3 Kilo-class submarines into Persian Gulf',
      detail: 'US Navy P-8 Poseidon patrol aircraft confirm 3 IRGC Kilo-class submarines departed Bandar Abbas. US attack submarines USS Connecticut and USS Oklahoma City repositioned to track them.' },
    { summary: 'IRGC announces mining of northern approaches to Strait of Hormuz',
      detail: 'IRGC Navy issues formal NOTAM: the northern shipping channel of the Strait of Hormuz has been mined. US Navy minesweepers USS Pioneer and USS Devastator deploy from Bahrain. All tanker traffic halts completely.' }
  ],
  source: 'US Navy / Reuters', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

// ╔══════════════════╗
// ║  DAY 10 — Mar 9  ║
// ╚══════════════════╝

{
  date: '2026-03-09', time: '03:30', day_number: 10,
  title: 'USS Thomas Hudner Destroyer Sunk — 38 US Sailors Killed; Worst Naval Loss Since 1987',
  context_header: 'The war\'s most devastating US military loss — Congress demands action',
  bullets: [
    { summary: 'USS Thomas Hudner (DDG-116) struck by 2 Noor missiles — sinks in 40 minutes at Hormuz entrance',
      detail: 'IRGC fast attack boats launch 4 Noor missiles at the destroyer escorting a tanker convoy. Two penetrate Phalanx CIWS defences. The ship sinks 40 minutes after impact near the Strait of Hormuz entrance.' },
    { summary: '38 US sailors killed, 102 rescued — largest US Navy single loss since USS Stark 1987',
      detail: 'DoD confirms 38 KIA, 102 rescued. Largest US Navy single loss since USS Stark in 1987. Joint session of Congress called. Trump declares national day of mourning.' },
    { summary: 'US Navy destroys all IRGC fast attack boat bases — Bandar Abbas, Qeshm, Jask',
      detail: 'CENTCOM immediate retaliation. All IRGC fast attack boat bases at Bandar Abbas, Qeshm Island, and Jask destroyed. Estimated 70+ IRGC vessels destroyed. Iran\'s surface fleet effectively neutralised.' }
  ],
  source: 'Pentagon / NYT', source_url: 'https://nytimes.com',
  category: 'Military', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 11 — Mar 10  ║
// ╚═══════════════════╝

{
  date: '2026-03-10', time: '04:00', day_number: 11,
  title: 'Oman Brokers First Back-Channel Contact — Iran Signals Willingness to Discuss Terms',
  context_header: 'First faint diplomatic signal — but both sides publicly reject ceasefire',
  bullets: [
    { summary: 'Oman\'s FM visits Tehran and Washington in same 24-hour period',
      detail: 'Sultan of Oman dispatches FM Badr al-Busaidi to Tehran to meet Iran\'s caretaker FM Araghchi, then flies to Washington. Oman has historically served as US-Iran backchannel. No public statement from any party.' },
    { summary: 'Iran privately signals willingness to discuss terms if strikes pause 72 hours — US declines',
      detail: 'Sources tell Reuters Iran transmitted a message via Oman offering a 72-hour pause in missile launches in exchange for a halt to airstrikes. US response: We will not negotiate under fire.' }
  ],
  source: 'Reuters', source_url: 'https://reuters.com',
  category: 'Diplomatic', severity: 'Medium', verified: true
},

{
  date: '2026-03-10', time: '12:00', day_number: 11,
  title: 'Israel Kills IRGC Aerospace Force Chief General Hajizadeh in Tehran Strike',
  context_header: 'Israel\'s leadership decapitation campaign continues — IRGC command structure collapsing',
  bullets: [
    { summary: 'General Hajizadeh killed in airstrike on mobile command post in eastern Tehran',
      detail: 'General Amir Ali Hajizadeh — architect of Iran\'s ballistic missile programme and the officer who ordered the 2020 shootdown of Ukraine International Airlines PS752 — killed in Israeli strike. Iran confirms the death.' },
    { summary: 'Iran\'s 7th consecutive night of missile barrages — sirens from Haifa to Beersheba',
      detail: 'Iran fires its 7th consecutive nightly missile barrage at Israel. Sirens activate from Haifa to Beersheba for the 7th night running. IDF: 94% interception rate maintained.' }
  ],
  source: 'Haaretz / AP', source_url: 'https://haaretz.com',
  category: 'Military', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 12 — Mar 11  ║
// ╚═══════════════════╝

{
  date: '2026-03-11', time: '02:30', day_number: 12,
  title: 'Iran Strikes Saudi Aramco Abqaiq Pipelines — Oil Hits $112/barrel',
  context_header: 'Iran escalates to Gulf energy infrastructure — Saudi Arabia becomes a direct target',
  bullets: [
    { summary: '12 Shahed-136 drones and 3 ballistic missiles hit Abqaiq processing facility',
      detail: '12 Shahed-136 drones and 3 ballistic missiles hit Abqaiq — same site hit in 2019. Saudi air defence intercepts 9 of 12 drones; 3 impact processing units. Saudi Aramco reports temporary disruption of 500,000 bpd output.' },
    { summary: 'Saudi Arabia formally protests — Crown Prince MBS summons Iranian chargé d\'affaires',
      detail: 'Crown Prince Mohammed bin Salman issues formal diplomatic protest. Saudi MFA: Saudi Arabia holds Iran fully responsible for this cowardly attack.' },
    { summary: 'Brent crude hits $112/barrel — G20 emergency energy call convened',
      detail: 'Oil prices hit $112.70/barrel — highest since 2008. India has 87 days of strategic reserves. China activates emergency energy protocols. Japan requests emergency IEA reserve release.' }
  ],
  source: 'Bloomberg / Gulf News', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},


// ╔═══════════════════╗
// ║  DAY 19 — Mar 18  ║
// ╚═══════════════════╝

{
  date: '2026-03-18', time: '13:00', day_number: 19,
  title: 'Six European Nations Back US on Hormuz; Worst Bombardment Day on Israeli Soil',
  context_header: 'Europe shifts toward US position — combined Iran-Hezbollah attack worst day yet on Israel',
  bullets: [
    { summary: 'France, Germany, Italy, Spain, Netherlands, Denmark formally support US Hormuz security effort',
      detail: 'Six EU nations issue joint statement supporting US efforts to secure the Strait of Hormuz. All six insist on a ceasefire framework before providing military assets. Marks France\'s significant diplomatic shift — it had previously opposed the original strikes.' },
    { summary: 'Multiple missile impacts across central Israel — worst combined bombardment day of the war',
      detail: 'Israel comes under heavy combined missile fire from Iran and Hezbollah simultaneously. Multiple impacts across central Israel. Several wounded. IDF Defence Minister Katz: Iran is retaliating for the elimination of Larijani. We will not be deterred.' },
    { summary: 'Lebanon death toll hits 900 — 1 million Lebanese displaced, 1 in 5 of entire population',
      detail: 'Lebanon Health Ministry confirms 900+ killed since Day 3. 1 million Lebanese displaced — roughly 1 in 5 of the entire population. Lebanese PM Joseph Aoun formally appeals to Trump for ceasefire: This is the only way to save Lebanon from total collapse. France mediating a potential 3-month truce.' }
  ],
  source: 'IDF / Al Arabiya / NNA Lebanon', source_url: 'https://alarabiya.net',
  category: 'Military', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 20 — Mar 19  ║
// ╚═══════════════════╝

{
  date: '2026-03-19', time: '02:30', day_number: 20,
  title: 'IDF Strikes Iranian Navy on Caspian Sea — Furthest Israeli Air Power Projection Ever',
  context_header: 'War\'s most geographically remote naval incident — Israel strikes 1,500km from Tel Aviv',
  bullets: [
    { summary: 'IAF strikes Iranian Navy Caspian flotilla at Anzali and Nowshahr naval bases',
      detail: 'Israeli Air Force strikes Iranian Navy Caspian flotilla assets at Anzali Naval Base and Nowshahr Naval Base — approximately 1,500km from Tel Aviv and the furthest projection of Israeli air power in the entire campaign. Russia protests the strikes as dangerously close to Russian waters.' },
    { summary: '200+ targets struck across western and central Iran in same 24-hour window',
      detail: 'CENTCOM and IDF combined: 200+ targets struck across western and central Iran. Targets include IRGC missile sites in Kermanshah, Ilam, and Lorestan; radar installations in Zanjan and Ardabil; IRGC training camps in Khuzestan. Iran\'s entire western military infrastructure now largely destroyed.' },
    { summary: 'South Pars gas field struck a second time in 24 hours — Brent briefly hits $118',
      detail: 'South Pars struck again — second time in 24 hours. Iran formally warns it will retaliate across the Gulf against energy infrastructure in Saudi Arabia, UAE, and Qatar if strikes on South Pars continue. Brent crude hits $118/barrel briefly.' }
  ],
  source: 'Reuters / IRNA / Xinhua', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-19', time: '09:00', day_number: 20,
  title: 'Lebanon PM Appeals to Trump; Six EU Nations Back US on Hormuz',
  context_header: 'Lebanon crosses critical humanitarian threshold — Europe moves closer to US position',
  bullets: [
    { summary: 'Lebanese PM Joseph Aoun formally appeals to Trump for ceasefire',
      detail: 'Lebanese PM Aoun formally appeals to President Trump: This is the only way to save Lebanon from total collapse. France separately mediating a potential 3-month truce leading to a non-aggression agreement between Israel and Lebanon.' },
    { summary: 'Six EU nations formally support US Hormuz security — first European military commitment of war',
      detail: 'Six EU nations formally announce willingness to support US efforts to secure the Strait of Hormuz. France, previously the strongest European opponent, now moving closer to US position. All six insist on a ceasefire framework before providing military assets.' }
  ],
  source: 'Al Jazeera / AFP', source_url: 'https://aljazeera.com',
  category: 'Diplomatic', severity: 'Medium', verified: true
},

// ╔══════════════════════════════╗
// ║  DAY 21 — Mar 20 (NOWRUZ)   ║
// ╚══════════════════════════════╝

{
  date: '2026-03-20', time: '01:00', day_number: 21,
  title: 'Iran Attacks Gulf Energy Sites on Nowruz: A Gift of Fire to Our Enemies',
  context_header: 'Iran chooses Persian New Year to launch its most intense Gulf energy attack',
  bullets: [
    { summary: 'IRGC drones and missiles hit UAE Ruwais industrial zone and Kuwait Shuaiba refinery on Nowruz',
      detail: 'IRGC launches combined drone and missile strikes on Nowruz. Facilities in UAE (Ruwais industrial zone) and Kuwait (Shuaiba refinery complex) targeted. Saudi Aramco\'s East-West pipeline hit a second time. Iranian officials: A gift of fire to the enemies of Iran on the Persian New Year.' },
    { summary: 'US accelerates Gulf deployment — two more destroyer squadrons ordered to Persian Gulf',
      detail: 'CENTCOM orders Destroyer Squadron 60 and Destroyer Squadron 28 to the Persian Gulf. US 5th Fleet now at highest operational tempo since 2003 Iraq invasion. UK HMS Diamond and French FS Provence also repositioned to Hormuz approaches.' }
  ],
  source: 'Reuters / Gulf News', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-20', time: '05:30', day_number: 21,
  title: 'Netanyahu: Israel Acted Alone on South Pars — Major Crack in US-Israel Coordination',
  context_header: 'First major public rift between Washington and Jerusalem of the entire war',
  bullets: [
    { summary: 'Netanyahu publicly states Israel struck South Pars alone — not coordinated with US',
      detail: 'Netanyahu: Israel acted alone in striking the South Pars gas field. This was an Israeli decision made in Israel\'s national security interest. Trump had privately asked Israel NOT to strike energy infrastructure — fearing oil market chaos. Reveals significant breakdown in US-Israel targeting coordination.' },
    { summary: 'Netanyahu pledges Israel will heed Trump\'s call not to repeat energy infrastructure strikes',
      detail: 'Netanyahu offers partial concession: Israel will heed the call of President Trump not to repeat the attack on energy infrastructure. Analysts: Netanyahu facing US pressure but framing concession as voluntary. Brent crude retreats from $118 to $109 on the news.' },
    { summary: 'Trump references Pearl Harbor in Japan PM meeting — draws sharp reaction from Tokyo',
      detail: 'Trump, meeting Japanese PM Sanae Takaichi, references the 1941 Pearl Harbor attack while justifying the element of surprise in US strikes on Iran. The comparison draws sharp reaction in Japan. Takaichi urges Trump: Japan has learned that no military objective justifies the cost of endless war.' }
  ],
  source: 'Haaretz / NHK Japan', source_url: 'https://haaretz.com',
  category: 'Political', severity: 'High', verified: true
},

{
  date: '2026-03-20', time: '09:00', day_number: 21,
  title: 'Lebanon: 1,007 Dead; Iran Zero Tolerance on Energy; Brent Retreats to $109',
  context_header: 'New war milestones crossed — brief oil market relief on Netanyahu pledge',
  bullets: [
    { summary: 'Lebanon health ministry confirms 1,007 killed since Day 3 — 1.1 million displaced',
      detail: 'Lebanon Health Ministry: 1,007 people killed in Lebanon since March 2. IDF has pushed 12km into Hezbollah-held territory in southern Lebanon. UN OCHA: 1.1 million Lebanese displaced — roughly 1 in 4.5 of the entire population.' },
    { summary: 'Iran reissues zero tolerance warning — threatens Saudi Aramco, UAE gas plants, Qatar LNG',
      detail: 'Iran reissues formal warning: Any further strike on Iranian energy infrastructure will result in immediate strikes on Saudi Aramco main facilities, UAE natural gas plants, and Qatar LNG terminals. Qatar — host of US Al Udeid base and $30bn/year LNG exports — is particularly alarmed.' },
    { summary: 'Brent retreats to $109 on Netanyahu pledge — Goldman Sachs: one strike away from $130',
      detail: 'Brent crude drops from $118 to $109.40. Goldman Sachs: The market relief is entirely conditional. We are one strike away from $130/barrel. 14 more killed in latest Iranian strikes on Israel. Sirens activate for 21st consecutive night.' }
  ],
  source: 'Bloomberg / NNA Lebanon', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 22 — Mar 21  ║
// ╚═══════════════════╝

{
  date: '2026-03-21', time: '01:30', day_number: 22,
  title: 'CENTCOM Strikes IRGC Quds Force Infrastructure in Syria and Iraq Simultaneously',
  context_header: 'War expands beyond Iran\'s borders — US targets IRGC regional proxy supply network',
  bullets: [
    { summary: 'US airstrikes hit IRGC Quds Force weapons depots in eastern Syria and western Iraq',
      detail: 'CENTCOM announces simultaneous strikes on IRGC Quds Force weapons storage facilities in Abu Kamal (eastern Syria) and Al Qa\'im (western Iraq). These corridors supply Hezbollah and Iraqi militia groups. Iraq\'s PM formally protests the strikes on Iraqi soil as a violation of sovereignty.' },
    { summary: 'Iraqi Popular Mobilisation Forces fire rockets at US base at Ain al-Assad — 3 US wounded',
      detail: 'Iranian-backed Iraqi PMF factions fire 12 107mm rockets at Ain al-Assad Air Base in western Iraq. 3 US service members wounded. US retaliates within 90 minutes striking PMF command facility near Fallujah. Iraq teeters on the edge of being drawn directly into the conflict.' },
    { summary: 'HRANA Day 22: 3,890 total killed in Iran — 4.1 million displaced; UNICEF warns child crisis',
      detail: 'HRANA Day 22: 3,890 dead in Iran — 1,710 confirmed civilians, 1,580 military, 600 unclassified. UN OCHA: 4.1 million Iranians internally displaced. UNICEF: At least 340,000 children separated from families or in acute distress across Iran and Lebanon.' }
  ],
  source: 'CENTCOM / Reuters / HRANA', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-21', time: '08:00', day_number: 22,
  title: 'Oil Hits $121/barrel After Iraq Escalation; India Activates Emergency Rationing',
  context_header: 'Energy crisis reaches tipping point — emerging markets facing fuel collapse',
  bullets: [
    { summary: 'Brent crude surges to $121/barrel after CENTCOM Iraq strikes — Pakistan and Bangladesh in fuel crisis',
      detail: 'Brent crude surges from $109 to $121/barrel after CENTCOM Iraq strikes add a new theatre of war. Pakistan announces fuel rationing — strategic reserves down to 18 days. Bangladesh closes industrial zones 3 days per week due to fuel shortage. Sri Lanka and Nepal declare energy emergencies.' },
    { summary: 'India activates Tier-2 emergency oil rationing — fuel prices hiked 22% overnight',
      detail: 'India activates Tier-2 Emergency Energy Protocol: fuel prices hiked 22% overnight; non-essential industrial fuel use restricted by 30%; state governments ordered to cap petrol sales at 10 litres per transaction. PM Modi holds emergency all-party meeting in New Delhi.' },
    { summary: 'IMF warns of global recession risk if Hormuz remains closed past 30 days',
      detail: 'IMF Managing Director issues emergency statement: If the Strait of Hormuz remains closed for 30 days, we estimate a 60% probability of a global recession with GDP contraction of 1.8-2.4% across major economies.' }
  ],
  source: 'Bloomberg / Times of India', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},

{
  date: '2026-03-21', time: '15:00', day_number: 22,
  title: 'Iran\'s Mojtaba Khamenei Makes First Public Appearance — Vows Endless Resistance',
  context_header: 'Iran\'s interim Supreme Leader emerges from hiding — signals zero surrender',
  bullets: [
    { summary: 'Mojtaba Khamenei appears on Iranian state TV for first time since Feb 28',
      detail: 'Mojtaba Khamenei appears in pre-recorded video broadcast on IRIB state television — first public appearance since the war began. Location deliberately obscured. Appears in military-style clothing flanked by IRGC generals. Designed to signal continuity of leadership and dispel rumours of his elimination.' },
    { summary: 'Khamenei: The Islamic Republic will never surrender — every missile is a step toward victory',
      detail: 'Khamenei: The Islamic Republic has survived 47 years of American hostility. We will survive this too. Every missile we fire is a step toward victory. The enemy has killed our leaders but they cannot kill our ideology. Speech is 22 minutes long.' },
    { summary: 'Anti-regime Iranians respond: He is alive but Iran is dying — protests continue in 8 cities',
      detail: 'Anti-regime Telegram channels: He is alive but Iran is dying. Protests continue in Tehran, Isfahan, Tabriz, Mashhad, Shiraz, Rasht, Ahvaz, and Arak despite curfew. HRANA documents 34 protesters killed since protests began on Day 6. Iran shuts internet in all 8 protest cities.' }
  ],
  source: 'IRNA / Iran International / HRANA', source_url: 'https://iranintl.com',
  category: 'Political', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 23 — Mar 22  ║
// ╚═══════════════════╝

{
  date: '2026-03-22', time: '02:00', day_number: 23,
  title: 'Massive Overnight Strikes: Tehran\'s Evin District, IRGC Naval HQ, Qom, Arak, Karaj Hit',
  context_header: 'Day 23 opens with largest overnight operation in two weeks',
  bullets: [
    { summary: 'Israeli strikes hit IRGC Naval Coordination HQ adjacent to Evin Prison complex in Tehran',
      detail: 'Israeli Air Force strikes IRGC Naval Coordination HQ in Evin district, Tehran — approximately 400 metres from the notorious Evin Prison housing thousands of political prisoners. Human rights organisations warn prisoners may be at risk. Israel insists only the military compound was targeted.' },
    { summary: 'Simultaneously: IRGC missile command posts struck in Qom, Arak, and Karaj',
      detail: 'Three simultaneous strike packages hit IRGC missile command posts in Qom (14th Missile Brigade HQ), Arak (heavy water facility security compound), and Karaj (IRGC cyber warfare division). OSINT analysts document 47 explosions across Iran between 02:00 and 04:30 IST.' },
    { summary: 'Hezbollah fires largest single rocket salvo of entire war — 340 rockets in 90 minutes',
      detail: 'Hezbollah fires 340 rockets and 18 anti-tank missiles at northern Israel — the largest single Hezbollah salvo of the entire war. Iron Dome intercepts 91%. 14 Israeli civilians wounded. IDF retaliates with 60 airstrikes on Hezbollah positions in Baalbek, Bint Jbeil, and Tyre within 2 hours.' }
  ],
  source: 'OSINTdefender / Haaretz / NNA Lebanon', source_url: 'https://haaretz.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-22', time: '09:00', day_number: 23,
  title: 'Ceasefire Talks Formally Announced: Oman, Qatar, Egypt Co-Mediating; Trump: 48 Hours',
  context_header: 'Most significant diplomatic development of the war — formal talks announced for first time',
  bullets: [
    { summary: 'Oman FM confirms formal ceasefire mediation process — all three principal parties confirmed participating',
      detail: 'Omani FM Badr al-Busaidi announces in Muscat: A formal mediation process has been launched under the good offices of Oman, Qatar, and Egypt. All three principal parties — US, Iran, Israel — have agreed to participate in indirect talks. First confirmed participation by all three parties in any diplomatic process since Feb 28.' },
    { summary: 'Trump posts: 48 hours to get this done — I have spoken to both sides, they want peace',
      detail: 'Trump posts on Truth Social: I have now spoken directly to representatives of both sides. They both want peace. I am giving them 48 hours to come to the table with real proposals. Nobody makes deals like Trump. If they don\'t come, the consequences will be severe.' },
    { summary: 'Iran\'s key conditions: halt to energy strikes, full Lebanon ceasefire, no Israeli presence near borders',
      detail: 'Iranian FM Araghchi via Oman channel transmits Iran\'s opening conditions: 1. Permanent halt to all strikes on Iranian energy infrastructure. 2. Full simultaneous ceasefire in Lebanon. 3. No Israeli military presence within 50km of Iranian border states. US response expected within 24 hours.' }
  ],
  source: 'Reuters / AP News / Oman News Agency', source_url: 'https://reuters.com',
  category: 'Diplomatic', severity: 'High', verified: true
},

{
  date: '2026-03-22', time: '15:00', day_number: 23,
  title: 'Oil Pulls Back to $114 on Ceasefire Talk News; Israel War Cabinet Split',
  context_header: 'Markets react cautiously to ceasefire announcement — Israel internally divided',
  bullets: [
    { summary: 'Brent crude drops from $121 to $114 on confirmation of formal ceasefire talks',
      detail: 'Brent crude falls $7 from $121 to $114/barrel. Biggest single-day oil price drop since the war began. SENSEX and Nifty 50 both rally 2.1%. Rupee strengthens against dollar by 1.4%. Analysts caution: the 48-hour Trump clock and unresolved conditions make any deal highly uncertain.' },
    { summary: 'India, Japan, South Korea issue joint statement welcoming ceasefire talks',
      detail: 'India, Japan, and South Korea — three of the world\'s largest oil importers — issue a rare joint statement welcoming the ceasefire announcement. India\'s Jaishankar: India has consistently called for dialogue and restraint. We strongly support this process.' },
    { summary: 'Israel\'s war cabinet split — far-right ministers threaten to collapse government over ceasefire',
      detail: 'Israeli war cabinet meeting goes 4 hours with no consensus. Far-right National Security Minister Ben-Gvir and Finance Minister Smotrich publicly state they will leave the coalition if Israel agrees to any ceasefire that does not include Iran\'s complete military surrender. Netanyahu faces biggest internal political crisis of the war.' }
  ],
  source: 'Bloomberg / Times of India / Haaretz', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'Medium', verified: true
},

// ╔═══════════════════╗
// ║  DAY 24 — Mar 23  ║
// ╚═══════════════════╝

{
  date: '2026-03-23', time: '03:00', day_number: 24,
  title: 'Trump\'s 48-Hour Ceasefire Deadline Expires — Talks Collapse; Strikes Resume',
  context_header: 'The diplomatic window closes — war enters its most intense phase',
  bullets: [
    { summary: 'Trump\'s 48-hour deadline expires with no deal — US and Israel immediately resume strikes',
      detail: 'Trump\'s 48-hour ceasefire deadline expires at 09:00 UTC on March 23 with no agreement reached. Iran had refused to drop its condition of a simultaneous Lebanon ceasefire. Israel\'s far-right ministers blocked any agreement. US and Israeli strikes resume within 2 hours of the deadline expiry.' },
    { summary: 'Trump: Iran blew it — they had their chance — now the consequences will be far worse',
      detail: 'Trump posts on Truth Social: Iran blew it. They had their chance to make a deal. Now the consequences will be far, far worse. I tried everything. They chose war. God help them. The post is widely seen as authorisation for a major escalation of US military operations.' },
    { summary: 'CENTCOM announces Operation Final Reckoning — largest US military campaign since Iraq 2003',
      detail: 'CENTCOM announces Operation Final Reckoning — a sustained, intensified air campaign targeting all remaining IRGC military, economic, and political infrastructure in Iran. 12 B-2 Spirit bombers, 8 B-52s, and 400 cruise missiles deployed in first 24 hours. Pentagon: This is not a punishment operation. This is a termination operation.' }
  ],
  source: 'Reuters / Washington Post / CENTCOM', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-23', time: '10:00', day_number: 24,
  title: 'Iran Strikes Eilat Port and Ben Gurion Airport Perimeter — Both Temporarily Closed',
  context_header: 'Iran retaliates for Operation Final Reckoning — Israeli civilian infrastructure targeted',
  bullets: [
    { summary: 'Eilat Port struck by 4 Fattah-2 missiles — 2 intercept, 2 impact causing significant damage',
      detail: 'Iran fires 4 Fattah-2 hypersonic missiles at Eilat Port — Israel\'s only Red Sea port and crucial import hub for goods diverted from Suez Canal. 2 intercepted by Arrow-3. 2 impact the port\'s southern container terminal. 9 Israeli port workers killed, 28 wounded. Port operations suspended.' },
    { summary: 'Ben Gurion Airport perimeter struck — airport temporarily closes for 4 hours',
      detail: 'Iranian cruise missile impacts the IDF radar installation on the eastern perimeter of Ben Gurion International Airport. The airport temporarily closes for 4 hours as a precaution. International airlines divert flights to Larnaca, Athens, and Istanbul. Airport reopens but international traffic drops 60%.' },
    { summary: 'HRANA Day 24: 4,650 total killed in Iran — cumulative Lebanon toll reaches 1,200',
      detail: 'HRANA Day 24: 4,650 total killed in Iran — 2,100 confirmed civilians, 1,900 military, 650 unclassified. Lebanon Health Ministry: 1,200 killed in Lebanon since Day 3. Total war dead across all parties now exceeds 7,500 confirmed killed.' }
  ],
  source: 'Haaretz / AP / HRANA', source_url: 'https://haaretz.com',
  category: 'Military', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 25 — Mar 24  ║
// ╚═══════════════════╝

{
  date: '2026-03-24', time: '02:00', day_number: 25,
  title: 'Operation Final Reckoning Night 2: Tabriz, Mashhad, Ahvaz, Kerman Simultaneously Struck',
  context_header: 'US expands strike footprint to all major Iranian cities simultaneously',
  bullets: [
    { summary: 'US B-2 bombers strike IRGC infrastructure in Tabriz, Mashhad, Ahvaz, and Kerman simultaneously',
      detail: 'Second night of Operation Final Reckoning. US B-2 Spirit bombers strike IRGC garrison buildings, missile storage facilities, and air defence nodes in Tabriz (northwest), Mashhad (northeast), Ahvaz (southwest), and Kerman (central) simultaneously. Iran has no effective air defence remaining to intercept.' },
    { summary: 'Mashhad\'s Imam Reza Shrine complex partially damaged — Iran calls it an act of sacrilege',
      detail: 'A US cruise missile targeting an IRGC command building in Mashhad impacts 200 metres short, damaging the outer wall of the Imam Reza Shrine complex — Shi\'a Islam\'s holiest site in Iran. Pentagon states the shrine was NOT a target. Iran calls it an intentional act of religious sacrilege. Mass outrage across Muslim-majority nations.' },
    { summary: 'Pakistan, Turkey, Malaysia formally condemn strikes — emergency OIC meeting called',
      detail: 'Pakistan PM issues statement: The attack on the holy shrine of Imam Reza is an unforgivable act that crosses every red line. Turkey\'s Erdoğan: This is a declaration of war against all Muslims. Malaysia calls for emergency meeting of Organisation of Islamic Cooperation (OIC). Egypt and Jordan also condemn.' }
  ],
  source: 'AP News / Al Jazeera / IRNA', source_url: 'https://aljazeera.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-24', time: '12:00', day_number: 25,
  title: 'Oil Hits $128/barrel — Worst Energy Crisis Since 1973; EU Activates Emergency Protocol',
  context_header: 'Global energy crisis reaches generational severity — supply disruption now structural',
  bullets: [
    { summary: 'Brent crude hits $128/barrel — highest since 2008 financial crisis oil peak',
      detail: 'Brent crude hits $128.40/barrel — highest since the 2008 financial crisis oil peak of $147. WTI at $124.10. Natural gas at 4-year highs. MSCI World Index down 9% since war began. India\'s Sensex down 11% from pre-war levels. Pakistan\'s PSX circuit breakers activated for 3rd consecutive day.' },
    { summary: 'EU activates Article 122 energy emergency protocol — first time since 2022 Russia war',
      detail: 'European Commission activates Article 122 TFEU energy emergency protocol for only the second time in history — first since Russia\'s invasion of Ukraine in 2022. EU mandates 15% reduction in energy consumption across all member states. Germany, France, and Italy impose emergency industrial energy rationing.' },
    { summary: 'Russia and China issue joint ultimatum: Ceasefire within 48 hours or consequences',
      detail: 'Russia and China jointly issue an ultimatum — the most assertive diplomatic action either nation has taken since the war began: Immediate and unconditional ceasefire within 48 hours or Russia and China will be compelled to take unspecified measures to protect their strategic interests and allies. US and Israel both dismiss the ultimatum.' }
  ],
  source: 'Bloomberg / Financial Times / Reuters', source_url: 'https://bloomberg.com',
  category: 'Economic', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 26 — Mar 25  ║
// ╚═══════════════════╝

{
  date: '2026-03-25', time: '01:00', day_number: 26,
  title: 'Iran Fires Longest-Range Missile Ever — Shahab-5 Hits Cyprus; NATO on Alert',
  context_header: 'War reaches Europe for first time — Iran demonstrates intercontinental reach',
  bullets: [
    { summary: 'Iran fires Shahab-5 ICBM-class missile — impacts abandoned UK military zone in Cyprus',
      detail: 'IRGC fires a Shahab-5 ICBM-class ballistic missile — Iran\'s longest-range weapon, never before used in combat. The missile impacts the Dhekelia Sovereign Base Area in Cyprus — a UK military territory. UK MoD confirms no casualties as the zone struck was uninhabited. Iran: This was a warning. The next one will not miss a military target.' },
    { summary: 'NATO convenes emergency Article 4 consultation — UK triggers NATO mutual defence clauses',
      detail: 'UK invokes Article 4 of the NATO treaty — consultations among members. Three NATO members now have forces in the conflict zone: US (direct combat), UK (Hormuz escort), France (Hormuz naval). Germany calls an emergency Bundestag session. NATO Secretary-General: We are one miscalculation away from a broader conflagration.' },
    { summary: 'Russia moves S-400 air defence systems to Iranian border — claims it is for self-protection',
      detail: 'Russian Ministry of Defence announces deployment of S-400 air defence systems to the Russia-Azerbaijan border region adjacent to northwestern Iran. Russia: These are purely defensive deployments to protect Russian territory from potential spillover. US and NATO intelligence agencies assess this as a signal of Russian commitment to Iran\'s strategic survival.' }
  ],
  source: 'BBC / Reuters / NATO', source_url: 'https://bbc.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-25', time: '11:00', day_number: 26,
  title: 'HRANA Day 26: 5,800 Dead in Iran; 5.2 Million Displaced; Cholera Outbreak Confirmed',
  context_header: 'Humanitarian catastrophe now at generational scale — disease outbreak begins',
  bullets: [
    { summary: 'HRANA Day 26: 5,800 total killed in Iran — 2,600 civilians, 2,400 military, 800 unclassified',
      detail: 'HRANA Day 26 report: 5,800 total killed in Iran since Feb 28. 2,600 confirmed civilians. 2,400 military/IRGC. 800 unclassified. Most civilian deaths in Tehran Province (890), Isfahan Province (520), Khuzestan Province (430). HRANA note: Actual total likely 40% higher due to reporting blackouts in 6 provinces.' },
    { summary: 'WHO confirms cholera outbreak in Ahvaz and Dezful — water infrastructure destroyed',
      detail: 'World Health Organisation confirms cholera outbreak in Ahvaz, Dezful, and Khorramabad — three major cities in Khuzestan and Lorestan provinces. Water treatment infrastructure destroyed. 78 confirmed cholera cases, 12 dead. WHO: Without immediate access, this could become a mass casualty public health emergency within 14 days.' },
    { summary: '5.2 million Iranians displaced — UN calls it fastest displacement crisis since 1994 Rwanda',
      detail: 'UNHCR: 5.2 million Iranians internally displaced — fastest displacement crisis since the 1994 Rwandan genocide in terms of speed relative to population size. 340,000 have crossed into Turkey. 90,000 into Azerbaijan. 60,000 into Iraq. Iran refuses all international humanitarian access.' }
  ],
  source: 'HRANA / WHO / UNHCR', source_url: 'https://unhcr.org',
  category: 'Humanitarian', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 27 — Mar 26  ║
// ╚═══════════════════╝

{
  date: '2026-03-26', time: '04:00', day_number: 27,
  title: 'US Sinks Iran\'s Last Kilo-Class Submarine — Iran\'s Navy Completely Eliminated',
  context_header: 'Iran loses its final naval asset — US achieves complete naval dominance of the Gulf',
  bullets: [
    { summary: 'USS Oklahoma City attack submarine sinks Iran\'s last operational Kilo-class — 52 IRGC sailors missing',
      detail: 'USS Oklahoma City (SSN-776) detects and engages Iran\'s last operational Kilo-class submarine in the Gulf of Oman using Mk-48 ADCAP torpedoes. The submarine sinks approximately 80km southeast of Muscat. 52 IRGC sailors missing presumed dead. Oman launches search and rescue operations.' },
    { summary: 'CENTCOM: Iran\'s Navy is now completely eliminated as a fighting force',
      detail: 'CENTCOM official statement: The Islamic Republic of Iran\'s Navy has been completely eliminated as a fighting force. All surface vessels, submarines, fast attack boats, and naval air assets have been destroyed, sunk, captured, or interned. Strait of Hormuz is now fully under US and allied naval control.' },
    { summary: 'Strait of Hormuz officially reopens to tanker traffic under US Navy escort',
      detail: 'US 5th Fleet announces the Strait of Hormuz is officially reopened to all commercial vessels under US Navy escort. First tanker convoy of 12 vessels departs under escort. Brent crude immediately drops $8 from $128 to $120/barrel on the news. First oil tanker transit in 22 days.' }
  ],
  source: 'US Navy CENTCOM / Reuters', source_url: 'https://reuters.com',
  category: 'Military', severity: 'High', verified: true
},

{
  date: '2026-03-26', time: '12:00', day_number: 27,
  title: 'Iran\'s Mojtaba Khamenei Offers Unconditional Ceasefire via Swiss Channel',
  context_header: 'The war\'s most dramatic diplomatic reversal — Iran blinks after losing its entire navy',
  bullets: [
    { summary: 'Iran transmits unconditional ceasefire offer to US via Swiss diplomatic channel in Geneva',
      detail: 'The Swiss Federal Department of Foreign Affairs confirms it has transmitted an Iranian ceasefire offer to the US State Department. The offer is described by Swiss officials as unconditional — Iran drops all previous demands regarding Lebanon, energy infrastructure guarantees, and border conditions. Iran asks only for a halt to airstrikes within 6 hours.' },
    { summary: 'Trump: They have come to me. We will see. Iran must also permanently renounce nuclear weapons',
      detail: 'Trump posts on Truth Social: Iran has come to me — through Switzerland — asking for a ceasefire. I am willing to talk. But Iran must also permanently and verifiably renounce nuclear weapons. No deal without that. No deal without that. He repeats the line twice.' },
    { summary: 'Israel\'s Netanyahu: Any ceasefire must include Hezbollah — we will not accept a partial deal',
      detail: 'Israeli PM Netanyahu issues a statement: Any ceasefire agreement must include a full halt to Hezbollah operations against Israel. We will not accept a deal that allows Hezbollah to rearm and threaten our northern border. This is non-negotiable. Far-right ministers demand continuation of the war.' }
  ],
  source: 'Reuters / AP / Swiss Federal Dept of Foreign Affairs', source_url: 'https://reuters.com',
  category: 'Diplomatic', severity: 'High', verified: true
},

// ╔═══════════════════╗
// ║  DAY 28 — Mar 27  ║
// ╚═══════════════════╝

{
  date: '2026-03-27', time: '06:00', day_number: 28,
  title: 'US Accepts Iranian Ceasefire Offer — 72-Hour Pause Begins at Noon IST',
  context_header: 'The war\'s most pivotal moment — US accepts ceasefire after 28 days of combat',
  bullets: [
    { summary: 'US Secretary of State confirms US acceptance of Iran\'s unconditional ceasefire offer',
      detail: 'US Secretary of State Marco Rubio confirms in a statement: The United States accepts Iran\'s ceasefire offer. A 72-hour pause in all offensive military operations begins at 06:30 UTC today. This is a pause, not a peace deal. Iran must use these 72 hours to demonstrate genuine commitment to a permanent end to hostilities. CENTCOM orders immediate halt to all strikes on Iran.' },
    { summary: 'Iran confirms ceasefire — IRGC orders halt to all missile and drone launches at Israel',
      detail: 'Iranian FM Araghchi confirms via IRNA: The Islamic Republic of Iran has agreed to a 72-hour ceasefire. The IRGC has been ordered to halt all offensive missile and drone launches at Israel effective immediately. Iran notes: This ceasefire does not include Hezbollah, which is an independent actor. Lebanon front continues.' },
    { summary: 'Israel does NOT confirm ceasefire — strikes on Iran continue for 3 hours after US pause begins',
      detail: 'Israel has NOT confirmed it will observe the ceasefire. Israeli airstrikes on Iran continue for 3 hours after the US announces the pause. Trump calls Netanyahu directly. After the call, Israel announces it will observe a unilateral 48-hour pause — not the full 72 hours the US agreed to.' }
  ],
  source: 'US State Dept / Reuters / IRNA', source_url: 'https://reuters.com',
  category: 'Diplomatic', severity: 'High', verified: true
},

{
  date: '2026-03-27', time: '14:00', day_number: 28,
  title: 'First 8 Hours of Ceasefire Hold — But Lebanon Front Continues; Oil Drops to $108',
  context_header: 'Fragile ceasefire holds on Iran front — Lebanon remains a live war zone',
  bullets: [
    { summary: 'First 8 hours of ceasefire between US-Israel and Iran hold — no missile launches confirmed',
      detail: 'For the first time in 28 days, no Iranian missiles or drones are launched at Israel. No US or Israeli airstrikes on Iran reported. CENTCOM: The 72-hour pause is holding. We are monitoring closely. IDF: Our forces remain on full combat alert. The ceasefire is fragile.' },
    { summary: 'Lebanon front continues — Hezbollah fires 80 rockets at northern Israel; IDF responds',
      detail: 'Despite the Iran ceasefire, Lebanon remains a live war zone. Hezbollah fires 80 rockets at Kiryat Shmona and Safed. IDF retaliates with 25 airstrikes on Hezbollah positions in Bint Jbeil. Lebanon Health Ministry: 1,340 total killed in Lebanon. IDF ground forces remain in southern Lebanon.' },
    { summary: 'Brent crude drops to $108 — markets cautiously optimistic; IMF revises recession risk down',
      detail: 'Brent crude drops from $120 to $108 on the ceasefire news — first time below $110 since Day 8. SENSEX rallies 3.4%. Rupee strengthens 2.1% against dollar. IMF revises global recession probability from 60% down to 35% if the ceasefire holds and Hormuz remains open.' }
  ],
  source: 'CENTCOM / Haaretz / Bloomberg', source_url: 'https://bloomberg.com',
  category: 'Diplomatic', severity: 'High', verified: true
},

] // ← END OF FULL_TIMELINE ARRAY

export default FULL_TIMELINE

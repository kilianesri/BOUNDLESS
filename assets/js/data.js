/* ============================================================
   BOUNDLESS — Dades d'exemple (DEMO)
   ⚠️ Tot fictici. Cap client real. Preus Sud = null ([per definir]).
   ============================================================ */
window.BOUNDLESS = window.BOUNDLESS || {};

BOUNDLESS.seed = {
  // ---- Tarifa: products (Nord sembrat, Sud per definir) ----
  products: [
    { id: 'p1', name: 'Tànger',                         zone: 'Nord', days: 1, cost_adult: 350,  cost_child: 250, active: true,
      includes: ['Pick-up / drop-off', 'Transport privat', 'Guia local', 'Experiències', 'Àpat típic'] },
    { id: 'p2', name: 'Chefchaouen + workshop',         zone: 'Nord', days: 1, cost_adult: 400,  cost_child: 300, active: true,
      includes: ['Pick-up / drop-off', 'Transport privat', 'Guia local', 'Workshop artesà', 'Dinar'] },
    { id: 'p3', name: 'Tetouan',                         zone: 'Nord', days: 1, cost_adult: 330,  cost_child: 250, active: true,
      includes: ['Pick-up / drop-off', 'Transport privat', 'Guia local', 'Visita medina (UNESCO)'] },
    { id: 'p4', name: 'Asilah',                          zone: 'Nord', days: 1, cost_adult: 300,  cost_child: 250, active: true,
      includes: ['Pick-up / drop-off', 'Transport privat', 'Guia local', 'Temps de platja'] },
    { id: 'p5', name: 'Pack 2 dies (Tànger + Chefchaouen)', zone: 'Nord', days: 2, cost_adult: 650, cost_child: 450, active: true,
      includes: ['Tot el dels day trips', 'Allotjament 1 nit', 'Esmorzars', 'Transport entre ciutats'] },
    { id: 'p6', name: 'Pack 3 dies (Tànger + Chaouen + Tetouan)', zone: 'Nord', days: 3, cost_adult: 950, cost_child: 550, active: true,
      includes: ['Tot el dels day trips', 'Allotjament 2 nits', 'Esmorzars', 'Transport entre ciutats'] },
    { id: 'p7', name: 'Pack 4 dies (tot el Nord)',       zone: 'Nord', days: 4, cost_adult: 1200, cost_child: 700, active: true,
      includes: ['Tànger + Chefchaouen + Tetouan + Asilah', 'Allotjament 3 nits', 'Mitja pensió', 'Transport complet'] },
    // ---- Sud / Imperials: cost PER DEFINIR (null) ----
    { id: 'p8', name: 'Marrakech + Desert (Merzouga)',   zone: 'Sud', days: 7, cost_adult: null, cost_child: null, active: true,
      includes: ['Marrakech', 'Agafay', 'Ouarzazate', 'Aït Ben Haddou', 'Merzouga'] },
    { id: 'p9', name: 'Marrakech + Costa (Essaouira)',   zone: 'Sud', days: 5, cost_adult: null, cost_child: null, active: true,
      includes: ['Marrakech', 'Agafay', 'Essaouira'] },
  ],

  // ---- Leads d'exemple (ficticis) ----
  leads: [
    { id: 'L-101', full_name: 'Família Andersen', email: 'andersen.demo@example.com', city_country: 'Oslo, Noruega',
      lang: 'EN', status: 'New', group_size: 4, adults: 2, children: 2, ages: '7, 10', destination: 'Nord',
      start_date: '2026-09-14', duration: 2, source: 'portal', step: 1, assigned: 'Kilian',
      trip_cost: null, closing_budget: null, next_action: 'Enviar enquesta de qualificació',
      special_needs: '' },
    { id: 'L-102', full_name: 'Família Rossi', email: 'rossi.demo@example.com', city_country: 'Milà, Itàlia',
      lang: 'ES', status: 'Email Reminder', group_size: 3, adults: 2, children: 1, ages: '9', destination: 'Nord',
      start_date: '2026-09-20', duration: 3, source: 'email', step: 3, assigned: 'Kilian',
      trip_cost: null, closing_budget: null, next_action: 'Recordatori (sense resposta 4 dies)',
      special_needs: 'Al·lèrgia fruits secs (1 nen)' },
    { id: 'L-103', full_name: 'Família Dubois', email: 'dubois.demo@example.com', city_country: 'Lió, França',
      lang: 'EN', status: 'Negotiation', group_size: 5, adults: 2, children: 3, ages: '5, 8, 11', destination: 'Nord',
      start_date: '2026-10-05', duration: 4, source: 'email', step: 5, assigned: 'Kilian',
      trip_cost: 4400, closing_budget: 5720, next_action: 'Confirmar dates allotjament',
      special_needs: '' },
    { id: 'L-104', full_name: 'Família Petrzelka', email: 'petrzelka.demo@example.com', city_country: 'Praga, Txèquia',
      lang: 'EN', status: 'Won', group_size: 6, adults: 4, children: 2, ages: '6, 9', destination: 'Sud',
      start_date: '2026-06-21', duration: 8, source: 'email', step: 6, assigned: 'Kilian',
      trip_cost: 4475, closing_budget: 5817.5, next_action: 'Enviar dossier final',
      special_needs: '' },
    { id: 'L-105', full_name: 'Família Lindqvist', email: 'lindqvist.demo@example.com', city_country: 'Estocolm, Suècia',
      lang: 'EN', status: 'New', group_size: 4, adults: 2, children: 2, ages: '4, 7', destination: 'Nord',
      start_date: '2026-10-10', duration: 1, source: 'portal', step: 1, assigned: 'Pau',
      trip_cost: null, closing_budget: null, next_action: 'Qualificar (day trip)',
      special_needs: '' },
    { id: 'L-106', full_name: 'Família Müller', email: 'muller.demo@example.com', city_country: 'Berlín, Alemanya',
      lang: 'EN', status: 'Negotiation', group_size: 4, adults: 2, children: 2, ages: '8, 12', destination: 'Sud',
      start_date: '2026-12-19', duration: 6, source: 'email', step: 5, assigned: 'Kilian',
      trip_cost: null, closing_budget: null, next_action: 'Definir cost Sud amb proveïdor',
      special_needs: 'Vegetarians' },
    { id: 'L-107', full_name: 'Família Costa', email: 'costa.demo@example.com', city_country: 'Lisboa, Portugal',
      lang: 'ES', status: 'Won', group_size: 3, adults: 2, children: 1, ages: '10', destination: 'Nord',
      start_date: '2026-05-30', duration: 3, source: 'portal', step: 6, assigned: 'Kilian',
      trip_cost: 2450, closing_budget: 3185, next_action: 'Tancat ✓',
      special_needs: '' },
    { id: 'L-108', full_name: 'Família Novak', email: 'novak.demo@example.com', city_country: 'Ljubljana, Eslovènia',
      lang: 'EN', status: 'Lost', group_size: 2, adults: 2, children: 0, ages: '—', destination: 'Nord',
      start_date: '2026-06-02', duration: 1, source: 'email', step: 6, assigned: 'Pau',
      trip_cost: null, closing_budget: null, next_action: 'Tancat (perdut)', loss_reason: 'Fora de pressupost',
      special_needs: '' },
    { id: 'L-109', full_name: 'Família Haugen', email: 'haugen.demo@example.com', city_country: 'Bergen, Noruega',
      lang: 'EN', status: 'Email Reminder', group_size: 5, adults: 2, children: 3, ages: '6, 9, 13', destination: 'Nord',
      start_date: '2026-09-28', duration: 4, source: 'portal', step: 2, assigned: 'Kilian',
      trip_cost: null, closing_budget: null, next_action: 'Proposta enviada, esperar resposta',
      special_needs: '' },
    { id: 'L-110', full_name: 'Família Brandt', email: 'brandt.demo@example.com', city_country: 'Copenhaguen, Dinamarca',
      lang: 'EN', status: 'Cancelled', group_size: 4, adults: 2, children: 2, ages: '5, 8', destination: 'Nord',
      start_date: '2026-02-15', duration: 2, source: 'email', step: 6, assigned: 'Pau',
      trip_cost: null, closing_budget: null, next_action: 'Cancel·lat per la família', loss_reason: 'Canvi de plans',
      special_needs: '' },
  ],

  // ---- Seguiment 6 passos (etiquetes) ----
  steps: ['Survey', 'Proposal', 'Email reminder', 'First call', 'Negotiation', 'Won/Lost'],

  // ---- Correu fil per lead (demo) ----
  threads: {
    'L-103': [
      { from: 'Família Dubois', when: 'fa 6 dies', body: 'Hi! We are a family of 5 (3 kids) staying in Estepona. We\'d love a 4-day trip to the North of Morocco in early October.' },
      { from: 'Kilian (BOUNDLESS)', when: 'fa 5 dies', body: 'Hola! Encantats. Us preparo una proposta de 4 dies (Tànger, Chefchaouen, Tetouan, Asilah). Confirmeu dates?' },
      { from: 'Família Dubois', when: 'fa 2 dies', body: 'Dates work for us. Could you confirm the accommodation and final price?' },
    ],
  },

  // ---- Safata Gmail (etiqueta "4.03.01. BOUNDLESS") ----
  gmail: [
    { id: 'g1', from: 'andersen.demo@example.com', subject: 'Family trip to Morocco - September',
      when: 'avui, 09:14', kind: 'new',
      extracted: { 'Nom': 'Família Andersen', 'Origen': 'Oslo, Noruega', 'Pax': '2 adults + 2 nens', 'Edats': '7, 10', 'Destí': 'Nord', 'Dates': '~14 set 2026', 'Durada': '2 dies' },
      missing: ['Pressupost', 'Allotjament preferit'],
      draft: 'Hola família Andersen,\n\nGràcies pel vostre interès en BOUNDLESS! Per preparar-vos la millor proposta, em podríeu confirmar el pressupost orientatiu i el tipus d\'allotjament que preferiu?\n\nUna abraçada,\nKilian — BOUNDLESS' },
    { id: 'g2', from: 'dubois.demo@example.com', subject: 'Re: Your 4-day North Morocco proposal',
      when: 'fa 2 dies, 18:40', kind: 'update', leadRef: 'L-103',
      extracted: { 'Lead existent': 'L-103 · Família Dubois', 'Novetat': 'Confirma dates', 'Acció': 'Passar a Negociació' },
      missing: [],
      draft: 'Hola família Dubois,\n\nPerfecte! Us confirmo allotjament i preu final avui mateix. Reservo les dates del 5 al 8 d\'octubre.\n\nKilian — BOUNDLESS' },
    { id: 'g3', from: 'newfamily.demo@example.com', subject: 'Day trip to Chefchaouen?',
      when: 'ahir, 12:02', kind: 'new',
      extracted: { 'Origen': 'Amsterdam, Països Baixos', 'Pax': '2 adults + 1 nen', 'Destí': 'Chefchaouen (day trip)', 'Dates': '[a confirmar]' },
      missing: ['Nom complet', 'Edats nens', 'Dates exactes'],
      draft: 'Hello!\n\nThanks for reaching out to BOUNDLESS. The Chefchaouen day trip (with artisan workshop) is wonderful for families. Could you share your exact dates and the children\'s ages?\n\nBest,\nKilian — BOUNDLESS' },
  ],

  // ---- Proveïdors ----
  suppliers: [
    { id: 's1', name: 'NUARNU Travel', agent: 'Younes', zone: 'Sud', state: 'Actiu', contact: 'younes.demo@example.com', notes: 'Proformes de circuits Marrakech + Desert.' },
    { id: 's2', name: 'Atlas Local Guides', agent: 'Hamid', zone: 'Nord', state: 'Actiu', contact: 'hamid.demo@example.com', notes: 'Guies oficials Tànger/Chefchaouen.' },
    { id: 's3', name: 'Riad Salam', agent: 'Fatima', zone: 'Nord', state: 'Actiu', contact: 'riad.demo@example.com', notes: 'Allotjament boutique Chefchaouen.' },
  ],

  supplier_quotes: [
    { id: 'q1', supplier_id: 's1', lead_ref: 'L-104', date: '2026-04-12', total_cost: 4475, currency: 'EUR', pax: 6,
      breakdown: { 'Allotjament (7 nits)': 1980, 'Transport 4x4 + xofer': 1250, 'Guies locals': 690, 'Experiències/desert': 555 }, source_doc: 'NUARNU_proforma_8d.pdf' },
    { id: 'q2', supplier_id: 's2', lead_ref: 'L-103', date: '2026-09-01', total_cost: 690, currency: 'EUR', pax: 5,
      breakdown: { 'Guia Tànger (2d)': 320, 'Guia Chefchaouen': 220, 'Guia Tetouan': 150 }, source_doc: 'atlas_quote_sept.pdf' },
  ],

  // ---- Proposals ----
  proposals: [
    { id: 'PR-01', lead_ref: 'L-103', product_id: 'p7', adults: 2, children: 3, margin_x: 0.30, lang: 'EN', created_at: '2026-09-02' },
    { id: 'PR-02', lead_ref: 'L-107', product_id: 'p6', adults: 2, children: 1, margin_x: 0.30, lang: 'ES', created_at: '2026-05-20' },
  ],

  // ---- Tasques / notificacions ----
  tasks: [
    { id: 't1', lead_ref: 'L-102', type: 'Recordatori', description: 'Recordatori a família Rossi (sense resposta 4 dies)', due_date: '2026-06-04', done: false, channel: 'gmail' },
    { id: 't2', lead_ref: 'L-103', type: 'Seguiment', description: 'Confirmar allotjament i enviar preu final', due_date: '2026-06-03', done: false, channel: 'internal' },
    { id: 't3', lead_ref: 'L-106', type: 'Proveïdor', description: 'Definir cost Sud (Marrakech + Desert) amb NUARNU', due_date: '2026-06-05', done: false, channel: 'internal' },
    { id: 't4', lead_ref: 'L-104', type: 'Lliurament', description: 'Enviar dossier final família Petrzelka', due_date: '2026-06-06', done: false, channel: 'gmail' },
    { id: 't5', lead_ref: 'L-109', type: 'Recordatori', description: 'Esperar resposta proposta família Haugen', due_date: '2026-06-07', done: false, channel: 'gmail' },
  ],

  // ---- Codis del portal de client ----
  access_codes: [
    { code: 'BLF-2026-AND', family: 'Família Andersen', email: 'andersen.demo@example.com', expires: '2026-09-30', active: true },
    { code: 'BLF-2026-DEMO', family: 'Demo (qualsevol família)', email: '—', expires: '2026-12-31', active: true },
  ],

  // ---- Contingut base per a l'itinerari (editable; activitats/allotjament per opció) ----
  itinerary_content: {
    p1: { activities: [
        'Guided walking tour through the historical city center',
        'Visit to Cape Spartel and the Caves of Hercules',
        'Camel ride along the Atlantic coast',
        'Visits to key museums and the vibrant medina' ],
      acc_note: 'Accommodation options:',
      accommodation: ['Grand Hotel Ville France ★★★★', 'Kasba Blanca Riad ★★★'] },
    p2: { activities: [
        'Private transport to Chefchaouen, the “Blue City”',
        'Guided walking tour through the medina and historical sites',
        'Hands-on workshop with a rural cooperative: choice of textile craft or traditional cooking',
        'Free time to explore artisan markets or relax in the town’s scenic squares' ],
      acc_note: 'Accommodation (if overnight stay is requested):',
      accommodation: ['Rural house hosted by a cooperative in the Rif Mountains', 'Local riad in Chefchaouen'] },
    p3: { activities: [
        'Guided visit through the UNESCO-listed medina of Tetouan',
        'Walk through craft districts and artisan quarters',
        'Visit to the Ethnographic Museum',
        'Free time in Hassan II Square and local souks' ],
      acc_note: 'Accommodation (if overnight stay is requested):',
      accommodation: ['Riad Blanco Boutique Hotel ★★★', 'Hotel Prestige ★★★★'] },
  },

  // ---- Llistes per defecte de l'itinerari ----
  itinerary_defaults: {
    title: 'Northern Morocco',
    subtitle: 'Medinas and markets, traditions and culture.',
    intro: [
      'This exclusive program is specially designed for Boundless Life families seeking enriching, educational, and authentic cultural experiences during their stay in Morocco.',
      'Supported by Aethnic, an organization dedicated to responsible tourism, this set of day trip experiences offers a unique way to explore the north of Morocco — combining guided tours, local community encounters, and immersive cultural workshops.',
      'Ideal for families with children, these excursions are led by expert cultural guides sensitive to the needs and rhythm of family travel. Each experience allows for meaningful moments of discovery, hands-on participation, and connection with Moroccan life.'
    ],
    included: ['Private transport with driver', 'Cultural guide throughout the experience',
      'Listed activities and entrance fees', 'Basic travel insurance', 'Local tourist taxes'],
    notIncluded: ['Meals and drinks (unless specified)', 'Tips and personal expenses',
      'Anything not listed under “Included”'],
    describedIds: ['p1', 'p2', 'p3'],
    pricedIds: ['p1', 'p2', 'p3', 'p5', 'p6'],
    margin: 0.30,
  },

  // ---- Equip (demo, sense contrasenyes reals) ----
  users: [
    { name: 'Kilian Estivill', email: 'demo-admin@boundless.test', role: 'admin' },
  ],
};

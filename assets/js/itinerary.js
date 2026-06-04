/* ============================================================
   BOUNDLESS — Generador d'itinerari CONFIGURABLE
   Dirigit per dades: parteix de la base de preus (products) i
   d'un objecte de configuració. Replica la plantilla PDF
   (Boundless Life · aethnic · weroots, bandes terracota, taula).
   Preus = cost de la base × (1 + marge). Sud = [per definir].
   ============================================================ */
window.BOUNDLESS = window.BOUNDLESS || {};

BOUNDLESS.itineraryHTML = function (cfg) {
  cfg = cfg || {};
  const products = cfg.products || [];
  const content = cfg.content || {};
  const margin = cfg.margin != null ? cfg.margin : 0.30;
  const eur = BOUNDLESS.eur;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

  const prod = (id) => products.find(p => p.id === id);
  const pvp = (p, who) => {
    const base = who === 'child' ? p.cost_child : p.cost_adult;
    if (base == null) return '[per definir]';
    return eur(BOUNDLESS.economy.pvp(base, margin));
  };
  const hasWorkshop = (p) => /workshop|chefchaouen|chaouen/i.test(p.name + ' ' + (p.includes || []).join(' '));
  const c = (id) => content[id] || {};
  const activitiesFor = (p) => (c(p.id).activities && c(p.id).activities.length) ? c(p.id).activities : (p.includes || []);
  const accFor = (p) => (c(p.id).accommodation && c(p.id).accommodation.length) ? c(p.id).accommodation : null;
  const accNote = (p) => c(p.id).acc_note || 'Accommodation (if requested):';

  const logos = `
    <div class="it-logos">
      <img class="bl" src="assets/img/logo-boundless.png" alt="Boundless Life">
      <img src="assets/img/logo-aethnic.png" alt="aethnic">
      <img src="assets/img/logo-weroots.jpg" alt="weroots">
    </div>`;

  const describedIds = (cfg.describedIds || []).filter(id => prod(id));
  const pricedIds = (cfg.pricedIds || []).filter(id => prod(id));
  const intro = cfg.intro || [];
  const included = cfg.included || [];
  const notIncluded = cfg.notIncluded || [];

  // ----- pàgines: portada + (opcions, 2 per full) + preus/inclou -----
  const optionPages = [];
  for (let i = 0; i < describedIds.length; i += 2) optionPages.push(describedIds.slice(i, i + 2));
  const hasPricing = pricedIds.length > 0;
  const totalPages = 1 + optionPages.length + (hasPricing ? 1 : 0);
  let pageNo = 0;
  const num = () => `<div class="it-pagenum">${++pageNo} / ${totalPages}</div>`;

  // Portada
  const cover = `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      <h1 class="it-title">${esc(cfg.title || 'Itinerari')}</h1>
      ${cfg.subtitle ? `<div class="it-sub">${esc(cfg.subtitle)}</div>` : ''}
      <div class="it-intro">${intro.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      ${cfg.cover !== false ? `<img class="it-cover-img" src="assets/img/cover-morocco.jpg" alt="${esc(cfg.title || '')}">` : ''}
      ${num()}
      <div class="it-band-bottom"></div>
    </section>`;

  // Opcions
  const optionSection = (id, idx) => {
    const p = prod(id);
    const acts = activitiesFor(p);
    const acc = accFor(p);
    return `
      <div class="it-opt">Option ${idx + 1}: <span>${esc(p.name)}</span></div>
      <div class="it-lead">Activities:</div>
      <ul class="it-ul sub">${acts.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      ${acc ? `<div class="it-lead">${esc(accNote(p))}</div>
        <ul class="it-ul">${acc.map(a => `<li>${esc(a)}</li>`).join('')}</ul>`
        : `<div class="it-lead">${esc(accNote(p))}</div>
        <ul class="it-ul"><li class="muted">[a confirmar]</li></ul>`}`;
  };
  let optIdx = 0;
  const optPagesHtml = optionPages.map((page, pi) => `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      ${pi === 0 ? '<div class="it-h2">TRIP OPTIONS:</div>' : ''}
      ${page.map(id => optionSection(id, optIdx++)).join('')}
      ${num()}
      <div class="it-band-bottom"></div>
    </section>`).join('');

  // Preus + inclou
  const pricingRow = (id) => {
    const p = prod(id);
    const dur = p.days + (p.days === 1 ? ' day' : ' days');
    const ck = '<span class="ck">✔</span>';
    return `<tr><td>${esc(p.name)}</td><td>${dur}</td><td>${ck}</td>
      <td>${hasWorkshop(p) ? ck : '–'}</td><td>${pvp(p, 'adult')}</td><td>${pvp(p, 'child')}</td></tr>`;
  };
  const pricingPage = !hasPricing ? '' : `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      <div class="it-section-h">Indicative Pricing Comparison:</div>
      <table class="it-pricing">
        <thead><tr><th>Option</th><th>Duration</th><th>Includes<br>Transport + Guide</th>
          <th>Workshop</th><th>Adult (€)</th><th>Child (€)</th></tr></thead>
        <tbody>${pricedIds.map(pricingRow).join('')}</tbody>
      </table>
      ${included.length ? `<div class="it-note">included in the price:</div>
        <ul class="it-ul">${included.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      ${notIncluded.length ? `<div class="it-note">Not included:</div>
        <ul class="it-ul">${notIncluded.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      ${num()}
      <div class="it-band-bottom"></div>
    </section>`;

  return `<div class="itinerary-doc">${cover}${optPagesHtml}${pricingPage}</div>`;
};

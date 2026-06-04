/* ============================================================
   BOUNDLESS — Generador d'itinerari (rèplica de la plantilla PDF)
   "Northern Morocco — Multioption (1 to 3 days)"
   Logos: Boundless Life · aethnic · weroots
   Preus: derivats de la Tarifa Nord actual (cost × 1,30), NO
   els preus obsolets de l'exemple (regla del kickoff).
   ============================================================ */
window.BOUNDLESS = window.BOUNDLESS || {};

BOUNDLESS.itineraryHTML = function (products, opts) {
  opts = opts || {};
  const margin = opts.margin != null ? opts.margin : 0.30;
  const eur = BOUNDLESS.eur;
  const pvp = (id, who) => {
    const p = (products || []).find(x => x.id === id);
    if (!p) return '—';
    const base = who === 'child' ? p.cost_child : p.cost_adult;
    if (base == null) return '[per definir]';
    return eur(BOUNDLESS.economy.pvp(base, margin));
  };
  const ck = '<span class="ck">✔</span>';
  const dash = '–';

  const logos = `
    <div class="it-logos">
      <img class="bl" src="assets/img/logo-boundless.png" alt="Boundless Life">
      <img src="assets/img/logo-aethnic.png" alt="aethnic">
      <img src="assets/img/logo-weroots.jpg" alt="weroots">
    </div>`;

  // ---------- Pàgina 1 — portada ----------
  const page1 = `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      <h1 class="it-title">Northern Morocco</h1>
      <div class="it-sub">Medinas and markets, traditions and culture.</div>
      <div class="it-intro">
        <p>This exclusive program is specially designed for Boundless Life families seeking
        enriching, educational, and authentic cultural experiences during their stay in Morocco.</p>
        <p>Supported by Aethnic, an organization dedicated to responsible tourism, this set of day
        trip experiences offers a unique way to explore the north of Morocco — combining guided
        tours, local community encounters, and immersive cultural workshops.</p>
        <p>Ideal for families with children, these excursions are led by expert cultural guides
        sensitive to the needs and rhythm of family travel. Each experience allows for meaningful
        moments of discovery, hands-on participation, and connection with Moroccan life.</p>
      </div>
      <img class="it-cover-img" src="assets/img/cover-morocco.jpg" alt="Northern Morocco">
      <div class="it-pagenum">1 / 3</div>
      <div class="it-band-bottom"></div>
    </section>`;

  // ---------- Pàgina 2 — opcions 1 i 2 ----------
  const page2 = `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      <div class="it-h2">TRIP OPTIONS:</div>

      <div class="it-opt">Option 1: <span>Day Trip Tangier</span></div>
      <div class="it-lead">Activities:</div>
      <ul class="it-ul sub">
        <li>Guided walking tour through the historical city center</li>
        <li>Visit to Cape Spartel and the Caves of Hercules</li>
        <li>Camel ride along the Atlantic coast</li>
        <li>Visits to key museums and the vibrant medina</li>
      </ul>
      <div class="it-lead">Accommodation options:</div>
      <ul class="it-ul">
        <li>Grand Hotel Ville France ★★★★</li>
        <li>Kasba Blanca Riad ★★★</li>
      </ul>

      <div class="it-opt">Option 2: <span>Day Trip Chefchaouen + Rural Cooperative Workshop</span></div>
      <div class="it-lead">Activities:</div>
      <ul class="it-ul sub">
        <li>Private transport to Chefchaouen, the &ldquo;Blue City&rdquo;</li>
        <li>Guided walking tour through the medina and historical sites</li>
        <li>Hands-on workshop with a rural cooperative: choice of textile craft or traditional cooking</li>
        <li>Free time to explore artisan markets or relax in the town&rsquo;s scenic squares</li>
      </ul>
      <div class="it-lead">Accommodation (if overnight stay is requested):</div>
      <ul class="it-ul">
        <li>Rural house hosted by a cooperative in the Rif Mountains</li>
        <li>Local riad in Chefchaouen</li>
      </ul>
      <div class="it-pagenum">2 / 3</div>
      <div class="it-band-bottom"></div>
    </section>`;

  // ---------- Pàgina 3 — opció 3 + preus + inclou ----------
  const page3 = `
    <section class="it-page">
      <div class="it-band-top"></div>
      ${logos}
      <div class="it-opt">Option 3: <span>Day Trip Tetouan</span></div>
      <div class="it-lead">Activities:</div>
      <ul class="it-ul sub">
        <li>Guided visit through the UNESCO-listed medina of Tetouan</li>
        <li>Walk through craft districts and artisan quarters</li>
        <li>Visit to the Ethnographic Museum</li>
        <li>Free time in Hassan II Square and local souks</li>
      </ul>
      <div class="it-lead">Accommodation (if overnight stay is requested):</div>
      <ul class="it-ul">
        <li>Riad Blanco Boutique Hotel ★★★</li>
        <li>Hotel Prestige ★★★★</li>
      </ul>

      <div class="it-section-h">Indicative Pricing Comparison:</div>
      <table class="it-pricing">
        <thead><tr>
          <th>Option</th><th>Duration</th><th>Includes<br>Transport + Guide</th>
          <th>Workshop</th><th>Adult (€)</th><th>Child (€)</th>
        </tr></thead>
        <tbody>
          <tr><td>Day Trip Tangier</td><td>1 day</td><td>${ck}</td><td>${dash}</td><td>${pvp('p1','adult')}</td><td>${pvp('p1','child')}</td></tr>
          <tr><td>Day Trip Chaouen + Workshop</td><td>1 day</td><td>${ck}</td><td>${ck}</td><td>${pvp('p2','adult')}</td><td>${pvp('p2','child')}</td></tr>
          <tr><td>Day Trip Tetouan</td><td>1 day</td><td>${ck}</td><td>${dash}</td><td>${pvp('p3','adult')}</td><td>${pvp('p3','child')}</td></tr>
          <tr><td>2-Day Combo (Tangier + Chaouen)</td><td>2 days</td><td>${ck}</td><td>${ck}</td><td>${pvp('p5','adult')}</td><td>${pvp('p5','child')}</td></tr>
          <tr><td>3-Day Combo (All 3 trips)</td><td>3 days</td><td>${ck}</td><td>${ck}</td><td>${pvp('p6','adult')}</td><td>${pvp('p6','child')}</td></tr>
        </tbody>
      </table>

      <div class="it-note">included in the price:</div>
      <ul class="it-ul">
        <li>Private transport with driver</li>
        <li>Cultural guide throughout the experience</li>
        <li>Listed activities and entrance fees</li>
        <li>Basic travel insurance</li>
        <li>Local tourist taxes</li>
      </ul>
      <div class="it-note">Not included:</div>
      <ul class="it-ul">
        <li>Meals and drinks (unless specified)</li>
        <li>Tips and personal expenses</li>
        <li>Anything not listed under &ldquo;Included&rdquo;</li>
      </ul>
      <div class="it-pagenum">3 / 3</div>
      <div class="it-band-bottom"></div>
    </section>`;

  return `<div class="itinerary-doc">${page1}${page2}${page3}</div>`;
};

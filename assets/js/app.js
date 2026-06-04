/* ============================================================
   BOUNDLESS — Aplicació demo (SPA, sense backend)
   Replica funcional de l'Excel + prototip, mode test.
   ============================================================ */
window.BOUNDLESS = window.BOUNDLESS || {};
(function () {
  const { economy, eur, pct } = BOUNDLESS;
  const STORE = 'boundless_demo_v1';

  // ---------- Estat ----------
  let db, session = { team: false, portalCode: null };

  function loadDB() {
    try {
      const saved = localStorage.getItem(STORE);
      db = saved ? JSON.parse(saved) : structuredClone(BOUNDLESS.seed);
    } catch (e) { db = structuredClone(BOUNDLESS.seed); }
  }
  function saveDB() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) {} }
  function resetDB() { localStorage.removeItem(STORE); loadDB(); }

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const app = () => document.getElementById('app');
  function go(hash) { location.hash = hash; }
  function toast(msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
  }

  const STATUS_ORDER = ['New', 'Email Reminder', 'Negotiation', 'Won', 'Lost', 'Cancelled'];
  const STATUS_CLASS = { 'New':'s-new','Email Reminder':'s-email','Negotiation':'s-negotiation','Won':'s-won','Lost':'s-lost','Cancelled':'s-cancelled' };
  function statusBadge(s) { return `<span class="badge ${STATUS_CLASS[s] || ''}">${esc(s)}</span>`; }
  function product(id) { return db.products.find(p => p.id === id); }
  function lead(id) { return db.leads.find(l => l.id === id); }
  function tripCostFor(p, adults, children) {
    if (!p || p.cost_adult == null) return null;
    return p.cost_adult * (adults || 0) + (p.cost_child || 0) * (children || 0);
  }

  // ---------- i18n proposta ----------
  const I18N = {
    CA: { proposal:'Proposta de viatge', includes:'Què inclou', excludes:'No inclou', total:'Preu total', perPerson:'Per persona', itinerary:'Itinerari', days:'dies', from:'des de', notInc:['Vols internacionals','Despeses personals','Propines'] },
    ES: { proposal:'Propuesta de viaje', includes:'Qué incluye', excludes:'No incluye', total:'Precio total', perPerson:'Por persona', itinerary:'Itinerario', days:'días', from:'desde', notInc:['Vuelos internacionales','Gastos personales','Propinas'] },
    EN: { proposal:'Trip proposal', includes:'What\'s included', excludes:'Not included', total:'Total price', perPerson:'Per person', itinerary:'Itinerary', days:'days', from:'from', notInc:['International flights','Personal expenses','Tips'] },
  };

  // ============================================================
  //  ROUTER
  // ============================================================
  function router() {
    const raw = (location.hash || '#/').replace(/^#/, '');
    const parts = raw.split('/').filter(Boolean); // ['lead','L-101']
    const route = parts[0] || '';

    // Portal (accés independent amb codi)
    if (route === 'portal') {
      if (parts[1] === 'wizard' && session.portalCode) return viewPortalWizard();
      return viewPortalAccess();
    }

    // Àrea equip requereix login
    if (!session.team) return viewLogin();

    switch (route) {
      case '': case 'dashboard': return viewDashboard();
      case 'leads': return viewLeads();
      case 'lead': return viewLeadDetail(parts[1]);
      case 'gmail': return viewGmail();
      case 'proposals': return parts[1] === 'new' ? viewGenerator(parts[2]) : viewProposals();
      case 'itinerary': return viewItinerary();
      case 'suppliers': return viewSuppliers();
      case 'tarifes': return viewTarifes();
      default: return viewDashboard();
    }
  }

  // ============================================================
  //  SHELL (topbar)
  // ============================================================
  function shell(active, body) {
    const nav = [
      ['dashboard','Tauler'], ['leads','Leads / CRM'], ['gmail','Safata Gmail'],
      ['proposals','Propostes'], ['suppliers','Proveïdors'], ['tarifes','Tarifes'],
    ].map(([k, t]) => `<a href="#/${k}" class="${active===k?'active':''}">${t}</a>`).join('');
    app().innerHTML = `
      <div class="topbar">
        <div class="logo"><span class="glyph">◈</span> BOUNDLESS</div>
        <nav class="nav">${nav}</nav>
        <div class="user">
          <img class="brandby" src="assets/img/logo-aethnic.png" alt="aethnic" title="Una eina d'AETHNIC">
          <a href="#/portal" class="btn ghost sm">Portal client ↗</a>
          <div class="avatar">KE</div>
          <a href="#" id="logout" class="muted">Sortir</a>
        </div>
      </div>
      <div class="page">${body}</div>
      <footer class="app-foot">BOUNDLESS · demo en mode test · dades fictícies ·
        <a href="#" id="resetdemo">restablir demo</a></footer>`;
    $('#logout').onclick = (e) => { e.preventDefault(); session.team = false; go('#/'); };
    $('#resetdemo').onclick = (e) => { e.preventDefault(); resetDB(); toast('Demo restablerta'); router(); };
  }

  // ============================================================
  //  LOGIN
  // ============================================================
  function viewLogin() {
    app().innerHTML = `
      <div class="auth-wrap"><div class="auth-card">
        <div class="logo"><span class="glyph">◈</span> BOUNDLESS</div>
        <div class="tagline">Àrea privada de l'equip</div>
        <div class="field"><label>Correu</label><input id="email" type="email" placeholder="el-teu@correu.cat" value="demo-admin@boundless.test"></div>
        <div class="field"><label>Contrasenya</label><input id="pass" type="password" placeholder="••••••••" value="demo"></div>
        <button class="btn block" id="loginbtn">Entrar</button>
        <div class="demo-hint">🔐 <b>Demo:</b> qualsevol credencial entra. El login real amb hash de contrasenya arriba a la Fase 1.</div>
        <div class="auth-switch">Ets família de Boundless Life? <a href="#/portal">Entra al portal de client →</a></div>
        <div class="auth-by"><span>Una eina d'</span><img src="assets/img/logo-aethnic.png" alt="aethnic"></div>
      </div></div>`;
    const enter = () => { session.team = true; go('#/dashboard'); };
    $('#loginbtn').onclick = enter;
    $('#pass').addEventListener('keydown', e => { if (e.key === 'Enter') enter(); });
  }

  // ============================================================
  //  DASHBOARD
  // ============================================================
  function viewDashboard() {
    const leads = db.leads;
    const active = leads.filter(l => ['New','Email Reminder','Negotiation'].includes(l.status));
    const won = leads.filter(l => l.status === 'Won');
    const closed = leads.filter(l => ['Won','Lost','Cancelled'].includes(l.status));
    const conv = closed.length ? Math.round(won.length / closed.length * 100) : 0;
    let totalComm = 0;
    won.forEach(l => { if (l.trip_cost != null && l.closing_budget != null) totalComm += economy.commission(l.closing_budget, l.trip_cost); });
    const kilian = economy.splits(totalComm).kilian;

    const kpis = [
      ['Leads totals', leads.length, '', `${active.length} actius`],
      ['Guanyats (Won)', won.length, 'olive', `conversió ${conv}%`],
      ['Comissió total', eur(totalComm), 'clay', 'només viatges tancats'],
      ['Part Kilian (40%)', eur(kilian), '', 'split 20 / 40 / 40'],
    ].map(([l,v,c,f]) => `<div class="kpi"><div class="label">${l}</div><div class="value ${c||''}">${v}</div><div class="foot">${f}</div></div>`).join('');

    const tasks = db.tasks.filter(t => !t.done).map(t => `
      <tr class="clickable" data-lead="${t.lead_ref}">
        <td><span class="badge tag">${esc(t.type)}</span></td>
        <td>${esc(t.description)}</td>
        <td class="nowrap">${esc(t.due_date)}</td>
        <td>${t.channel === 'gmail' ? '✉️ Gmail' : '🏠 Intern'}</td>
        <td class="right"><button class="btn ghost sm done" data-id="${t.id}">Fet</button></td>
      </tr>`).join('');

    shell('dashboard', `
      <div class="page-head"><div><h1>Tauler</h1><div class="sub">Visió general del pipeline BOUNDLESS</div></div></div>
      <div class="grid cols-4">${kpis}</div>
      <div class="section-title">Tasques pendents <small>notificacions i seguiments (Gmail / interns)</small></div>
      <div class="card"><table class="tbl">
        <thead><tr><th>Tipus</th><th>Descripció</th><th>Venciment</th><th>Canal</th><th></th></tr></thead>
        <tbody>${tasks || '<tr><td colspan="5" class="muted center">Cap tasca pendent 🎉</td></tr>'}</tbody>
      </table></div>`);

    $$('.done').forEach(b => b.onclick = (e) => { e.stopPropagation(); const t = db.tasks.find(x => x.id === b.dataset.id); t.done = true; saveDB(); viewDashboard(); toast('Tasca marcada com a feta'); });
    $$('tr[data-lead]').forEach(r => r.onclick = () => go('#/lead/' + r.dataset.lead));
  }

  // ============================================================
  //  LEADS — Kanban 6 columnes
  // ============================================================
  function viewLeads() {
    const cols = STATUS_ORDER.map(st => {
      const items = db.leads.filter(l => l.status === st);
      const cards = items.map(l => leadCard(l)).join('') || '<div class="muted" style="font-size:12px;padding:6px">—</div>';
      return `<div class="kcol"><h3>${esc(st)} <span class="count">${items.length}</span></h3>${cards}</div>`;
    }).join('');

    shell('leads', `
      <div class="page-head">
        <div><h1>Leads / CRM</h1><div class="sub">Pipeline de 6 estats · protocol de 6 passos · arrossega amb ‹ ›</div></div>
        <button class="btn" id="newlead">+ Nou lead</button>
      </div>
      <div class="kanban">${cols}</div>`);

    $$('.lead-card').forEach(c => c.onclick = (e) => { if (e.target.closest('.move')) return; go('#/lead/' + c.dataset.id); });
    $$('.mv').forEach(b => b.onclick = (e) => {
      e.stopPropagation();
      const l = lead(b.dataset.id); const i = STATUS_ORDER.indexOf(l.status);
      const ni = i + (b.dataset.dir === 'r' ? 1 : -1);
      if (ni >= 0 && ni < STATUS_ORDER.length) { l.status = STATUS_ORDER[ni]; if (ni === 5) l.step = 6; saveDB(); viewLeads(); }
    });
    $('#newlead').onclick = () => { toast('Alta manual de lead → formulari complet a la Fase 1'); };
  }

  function leadCard(l) {
    return `<div class="lead-card" data-id="${l.id}">
      <div class="name">${esc(l.full_name)}</div>
      <div class="meta"><span class="badge lang">${esc(l.lang)}</span> ${l.adults}A·${l.children}N · ${esc(l.destination)} · ${l.duration}d</div>
      <div class="progress"><span style="width:${(l.step/6*100)}%"></span></div>
      <div class="move">
        <button class="mv" data-id="${l.id}" data-dir="l" title="Enrere">‹</button>
        <span class="muted" style="font-size:11px">pas ${l.step}/6</span>
        <button class="mv" data-id="${l.id}" data-dir="r" title="Endavant">›</button>
      </div>
    </div>`;
  }

  // ============================================================
  //  LEAD DETAIL
  // ============================================================
  function viewLeadDetail(id) {
    const l = lead(id);
    if (!l) return go('#/leads');
    const thread = (db.threads[id] || []);
    const steps = BOUNDLESS.seed.steps.map((s, i) => {
      const n = i + 1; const cls = n < l.step ? 'done' : n === l.step ? 'current' : '';
      return `<div class="step ${cls}">${n}. ${s}</div>`;
    }).join('');

    shell('leads', `
      <div class="page-head">
        <div><a href="#/leads" class="muted">‹ Leads</a><h1>${esc(l.full_name)}</h1>
          <div class="sub">${esc(l.id)} · ${esc(l.city_country)} · ${statusBadge(l.status)}</div></div>
        <button class="btn olive" id="genprop">Generar proposta →</button>
      </div>
      <div class="detail-grid">
        <div>
          <div class="card">
            <h3 style="margin-bottom:12px">Dades del lead</h3>
            <div class="row">
              <div class="field"><label>Estat</label><select id="f-status">${STATUS_ORDER.map(s=>`<option ${s===l.status?'selected':''}>${s}</option>`).join('')}</select></div>
              <div class="field"><label>Assignat a</label><input id="f-assigned" value="${esc(l.assigned||'')}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Adults</label><input id="f-adults" type="number" min="0" value="${l.adults}"></div>
              <div class="field"><label>Nens</label><input id="f-children" type="number" min="0" value="${l.children}"></div>
              <div class="field"><label>Edats</label><input id="f-ages" value="${esc(l.ages||'')}"></div>
            </div>
            <div class="row">
              <div class="field"><label>Destí</label><input id="f-dest" value="${esc(l.destination)}"></div>
              <div class="field"><label>Inici</label><input id="f-date" type="date" value="${esc(l.start_date||'')}"></div>
              <div class="field"><label>Durada (dies)</label><input id="f-dur" type="number" min="1" value="${l.duration}"></div>
            </div>
            <div class="field"><label>Necessitats especials</label><input id="f-needs" value="${esc(l.special_needs||'')}" placeholder="al·lèrgies, salut…"></div>
            <div class="field"><label>Pròxima acció</label><input id="f-next" value="${esc(l.next_action||'')}"></div>
            <button class="btn" id="savelead">Desar canvis</button>
          </div>

          <div class="card" style="margin-top:16px">
            <h3>Seguiment (6 passos)</h3>
            <div class="steps">${steps}</div>
            <div class="muted" style="font-size:13px">Pas actual: <b>${l.step}/6 — ${esc(BOUNDLESS.seed.steps[l.step-1]||'')}</b></div>
          </div>
        </div>

        <div>
          <div class="card" id="econ-card">
            <h3 style="margin-bottom:6px">Economia</h3>
            <div class="muted" style="font-size:12.5px;margin-bottom:12px">PVP = Cost × (1 + marge) · Comissió = PVP − Cost · split 20/40/40</div>
            <div class="row">
              <div class="field"><label>Cost proveïdor (€)</label><input id="e-cost" type="number" min="0" value="${l.trip_cost ?? ''}" placeholder="[per definir]"></div>
              <div class="field"><label>Marge X</label>
                <select id="e-margin">
                  <option value="0.30" selected>30% (Nord)</option>
                  <option value="0.35">35%</option>
                  <option value="0.40">40%</option>
                </select></div>
            </div>
            <div id="econ-out"></div>
          </div>

          <div class="card" style="margin-top:16px">
            <h3 style="margin-bottom:10px">Fil de correu (Gmail)</h3>
            <div class="thread">${thread.length ? thread.map(m=>`<div class="mail"><span class="when">${esc(m.when)}</span><div class="from">${esc(m.from)}</div><div>${esc(m.body)}</div></div>`).join('') : '<div class="muted" style="font-size:13px">Cap correu vinculat encara.</div>'}</div>
          </div>
        </div>
      </div>`);

    function renderEcon() {
      const cost = parseFloat($('#e-cost').value);
      const margin = parseFloat($('#e-margin').value);
      const out = $('#econ-out');
      if (isNaN(cost) || cost <= 0) { out.innerHTML = `<div class="muted" style="font-size:13px">Introdueix el cost de proveïdor per calcular el PVP. <i>(No s'inventa cap valor.)</i></div>`; return; }
      const r = economy.compute({ tripCost: cost, marginX: margin, adults: +$('#f-adults').value, children: +$('#f-children').value, days: +$('#f-dur').value });
      const tgt = r.inTarget === null ? '<span class="muted">no aplica (1 dia)</span>'
        : r.inTarget ? '<span class="target-ok">✓ dins objectiu</span>' : '<span class="target-no">✕ fora (320–340)</span>';
      out.innerHTML = `
        <div class="stats">
          <div class="statbox accent"><div class="l">PVP (Closing)</div><div class="v">${eur(r.closingBudget)}</div></div>
          <div class="statbox"><div class="l">Comissió</div><div class="v">${eur(r.commission)}</div></div>
          <div class="statbox"><div class="l">Benefici/pax</div><div class="v">${eur(r.benefitPerPax)}</div></div>
        </div>
        <div class="stats" style="margin-top:10px">
          <div class="statbox"><div class="l">Boundless 20%</div><div class="v">${eur(r.splits.boundless)}</div></div>
          <div class="statbox"><div class="l">TURISCOOP·AETHNIC 40%</div><div class="v">${eur(r.splits.turiscoop_aethnic)}</div></div>
          <div class="statbox"><div class="l">Kilian 40%</div><div class="v">${eur(r.splits.kilian)}</div></div>
        </div>
        <div style="margin-top:10px;font-size:13px">Objectiu 320–340 €/pax: ${tgt}</div>`;
      l.trip_cost = cost; l.closing_budget = r.closingBudget;
    }
    ['e-cost','e-margin','f-adults','f-children','f-dur'].forEach(idd => { const el = $('#'+idd); el && el.addEventListener('input', renderEcon); });
    renderEcon();

    $('#savelead').onclick = () => {
      l.status = $('#f-status').value; l.assigned = $('#f-assigned').value;
      l.adults = +$('#f-adults').value; l.children = +$('#f-children').value; l.group_size = l.adults + l.children;
      l.ages = $('#f-ages').value; l.destination = $('#f-dest').value; l.start_date = $('#f-date').value;
      l.duration = +$('#f-dur').value; l.special_needs = $('#f-needs').value; l.next_action = $('#f-next').value;
      saveDB(); toast('Lead desat'); viewLeadDetail(id);
    };
    $('#genprop').onclick = () => go('#/proposals/new/' + id);
  }

  // ============================================================
  //  SAFATA GMAIL
  // ============================================================
  function viewGmail() {
    const rows = db.gmail.map(m => {
      const chips = Object.entries(m.extracted).map(([k,v]) => `<span class="chip"><b>${esc(k)}:</b> ${esc(v)}</span>`).join('');
      const miss = m.missing.map(x => `<span class="chip miss">falta: ${esc(x)}</span>`).join('');
      const kind = m.kind === 'new' ? '<span class="badge s-new">Nou lead</span>' : '<span class="badge s-negotiation">Actualització</span>';
      return `<div class="mailrow">
        <div class="head"><div><div class="subject">${esc(m.subject)}</div><div class="muted" style="font-size:12.5px">de ${esc(m.from)} · ${esc(m.when)} · etiqueta "4.03.01. BOUNDLESS"</div></div>${kind}</div>
        <div class="chips">${chips} ${miss}</div>
        <div class="muted" style="font-size:12.5px;margin-top:6px">Esborrany de resposta (${m.missing.length? 'qualificació':'amb continuïtat'}):</div>
        <div class="draft">${esc(m.draft)}</div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn sm process" data-id="${m.id}">${m.kind==='new'?'Crear lead':'Actualitzar lead'}</button>
          <button class="btn ghost sm">Editar esborrany</button>
        </div>
      </div>`;
    }).join('');

    shell('gmail', `
      <div class="page-head"><div><h1>Safata Gmail</h1>
        <div class="sub">Correus amb etiqueta <b>"4.03.01. BOUNDLESS"</b> · extracció per regles (lògica reaprofitada de l'Apps Script)</div></div></div>
      <div class="mailcard">${rows}</div>`);

    $$('.process').forEach(b => b.onclick = () => {
      const m = db.gmail.find(x => x.id === b.dataset.id);
      toast(m.kind === 'new' ? 'Lead creat al CRM (source=email) — demo' : 'Lead actualitzat — demo');
    });
  }

  // ============================================================
  //  PROPOSTES (llista)
  // ============================================================
  function viewProposals() {
    const rows = db.proposals.map(pr => {
      const p = product(pr.product_id); const l = lead(pr.lead_ref);
      const tc = tripCostFor(p, pr.adults, pr.children);
      const pvp = tc == null ? null : economy.pvp(tc, pr.margin_x);
      return `<tr class="clickable" data-id="${pr.id}">
        <td><b>${esc(pr.id)}</b></td><td>${l?esc(l.full_name):esc(pr.lead_ref)}</td>
        <td>${esc(p?p.name:'—')}</td><td>${pr.adults}A·${pr.children}N</td>
        <td>${pct(pr.margin_x)}</td><td><b>${pvp==null?'[per definir]':eur(pvp)}</b></td>
        <td><span class="badge lang">${esc(pr.lang)}</span></td><td class="nowrap">${esc(pr.created_at)}</td></tr>`;
    }).join('');

    shell('proposals', `
      <div class="page-head"><div><h1>Propostes</h1><div class="sub">Propostes de viatge generades · PDF CA/ES/EN</div></div>
        <div style="display:flex;gap:8px"><a href="#/itinerary" class="btn ghost">📄 Itinerari (plantilla PDF)</a>
        <button class="btn" id="newprop">+ Nova proposta</button></div></div>
      <div class="card"><table class="tbl">
        <thead><tr><th>Ref</th><th>Lead</th><th>Producte</th><th>Pax</th><th>Marge</th><th>PVP</th><th>Idioma</th><th>Data</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="8" class="center muted">Cap proposta encara</td></tr>'}</tbody></table></div>`);

    $('#newprop').onclick = () => go('#/proposals/new');
    $$('tr[data-id]').forEach(r => r.onclick = () => { const pr = db.proposals.find(x=>x.id===r.dataset.id); go('#/proposals/new/' + (pr.lead_ref||'')); });
  }

  // ============================================================
  //  ITINERARI (document tipus PDF, rèplica de la plantilla)
  // ============================================================
  function viewItinerary() {
    const doc = BOUNDLESS.itineraryHTML(db.products, { margin: 0.30 });
    shell('proposals', `
      <div class="it-toolbar no-print">
        <div><a href="#/proposals" class="muted">‹ Propostes</a>
          <h1 style="font-size:24px;margin-top:2px">Itinerari — Northern Morocco</h1>
          <div class="sub">Rèplica de la plantilla · logos Boundless Life · aethnic · weroots · preus de la Tarifa Nord actual (30%)</div></div>
        <button class="btn" id="printit">⬇ Descarregar / Imprimir PDF</button>
      </div>
      ${doc}`);
    $('#printit').onclick = () => window.print();
  }

  // ============================================================
  //  GENERADOR DE PROPOSTES
  // ============================================================
  function viewGenerator(leadId) {
    const l = leadId ? lead(leadId) : null;
    const opts = db.products.map(p => `<option value="${p.id}" ${p.zone==='Sud'?'data-sud="1"':''}>${esc(p.name)} (${p.zone}, ${p.days}d)</option>`).join('');

    shell('proposals', `
      <div class="page-head"><div><a href="#/proposals" class="muted">‹ Propostes</a><h1>Generador de propostes</h1>
        <div class="sub">${l?('Per a '+esc(l.full_name)+' · '):''}selecciona producte, pax i marge → vista prèvia</div></div></div>
      <div class="detail-grid">
        <div class="card">
          <div class="field"><label>Producte</label><select id="g-prod">${opts}</select></div>
          <div class="row">
            <div class="field"><label>Adults</label><input id="g-adults" type="number" min="0" value="${l?l.adults:2}"></div>
            <div class="field"><label>Nens</label><input id="g-children" type="number" min="0" value="${l?l.children:0}"></div>
          </div>
          <div class="row">
            <div class="field"><label>Marge X</label><select id="g-margin"><option value="0.30">30% (Nord)</option><option value="0.35">35%</option><option value="0.40">40%</option></select></div>
            <div class="field"><label>Idioma</label><select id="g-lang"><option>CA</option><option ${l&&l.lang==='ES'?'selected':''}>ES</option><option ${l&&l.lang==='EN'?'selected':''}>EN</option></select></div>
          </div>
          <button class="btn block" id="g-pdf">⬇ Exportar PDF</button>
          <a href="#/itinerary" class="btn ghost block" style="margin-top:8px">📄 Veure itinerari complet (plantilla PDF)</a>
          <div class="demo-hint">El PDF real (server-side) es genera a la <b>Fase 3</b>. Aquí en veus la vista prèvia.</div>
        </div>
        <div id="prop-preview"></div>
      </div>`);

    function render() {
      const p = product($('#g-prod').value);
      const adults = +$('#g-adults').value, children = +$('#g-children').value;
      const margin = parseFloat($('#g-margin').value);
      const lang = $('#g-lang').value; const t = I18N[lang];
      const tc = tripCostFor(p, adults, children);
      const box = $('#prop-preview');
      if (tc == null) {
        box.innerHTML = `<div class="proposal"><div class="ph"><h2>${esc(p.name)}</h2></div>
          <p class="muted">Aquest producte (zona <b>Sud</b>) encara té el cost <b>[per definir]</b>. No s'inventa cap preu: la proposta es completarà quan es defineixi amb el proveïdor.</p>
          <ul class="inc-list" style="margin-top:12px">${p.includes.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>`;
        return;
      }
      const pvp = economy.pvp(tc, margin); const pax = adults + children;
      box.innerHTML = `<div class="proposal">
        <div class="ph"><div><div class="muted" style="font-size:12px;letter-spacing:.1em">◈ BOUNDLESS</div><h2>${esc(p.name)}</h2>
          <div class="muted">${p.days} ${t.days} · ${adults} ${lang==='EN'?'adults':lang==='ES'?'adultos':'adults'} + ${children} ${lang==='EN'?'children':lang==='ES'?'niños':'nens'}</div></div>
          <div class="right"><div class="muted" style="font-size:12px">${t.total}</div><div class="price-tag">${eur(pvp)}</div><div class="muted" style="font-size:12px">${t.perPerson}: ${eur(Math.round(pvp/pax))}</div></div></div>
        <h3 style="font-size:16px;margin:6px 0">${t.includes}</h3>
        <ul class="inc-list">${p.includes.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
        <h3 style="font-size:16px;margin:14px 0 6px">${t.excludes}</h3>
        <ul class="inc-list exc-list">${t.notInc.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
      </div>`;
    }
    ['g-prod','g-adults','g-children','g-margin','g-lang'].forEach(idd => $('#'+idd).addEventListener('input', render));
    $('#g-pdf').onclick = () => toast('Generació de PDF → Fase 3 (Dompdf/Puppeteer al backend)');
    render();
  }

  // ============================================================
  //  PROVEÏDORS
  // ============================================================
  function viewSuppliers() {
    const sup = db.suppliers.map(s => `<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.agent)}</td><td>${esc(s.zone)}</td>
      <td><span class="badge s-won">${esc(s.state)}</span></td><td>${esc(s.contact)}</td><td class="muted">${esc(s.notes)}</td></tr>`).join('');

    const quotes = db.supplier_quotes.map(q => {
      const s = db.suppliers.find(x=>x.id===q.supplier_id);
      const bd = Object.entries(q.breakdown).map(([k,v])=>`<span class="chip">${esc(k)}: ${eur(v)}</span>`).join(' ');
      return `<div class="mailrow"><div class="head"><div><div class="subject">${esc(s?s.name:'')} — ${eur(q.total_cost)} <span class="muted" style="font-weight:400">(${q.pax} pax)</span></div>
        <div class="muted" style="font-size:12.5px">${esc(q.date)} · doc: ${esc(q.source_doc)} ${q.lead_ref?'· lead '+esc(q.lead_ref):''}</div></div>
        <button class="btn ghost sm parse" data-id="${q.id}">Extreure de factura</button></div>
        <div class="chips" style="margin-top:8px">${bd}</div></div>`;
    }).join('');

    shell('suppliers', `
      <div class="page-head"><div><h1>Proveïdors</h1><div class="sub">BBDD de cotitzacions + extracció de factures/proformes (tipus NUARNU)</div></div></div>
      <div class="card"><table class="tbl">
        <thead><tr><th>Proveïdor</th><th>Agent</th><th>Zona</th><th>Estat</th><th>Contacte</th><th>Notes</th></tr></thead>
        <tbody>${sup}</tbody></table></div>
      <div class="section-title">Cotitzacions <small>desglossament per hotels / activitats / guies / transport</small></div>
      ${quotes}`);

    $$('.parse').forEach(b => b.onclick = () => toast('Parseig de PDF/proforma → Fase 4 (extracció automàtica de l\'import i el desglossament)'));
  }

  // ============================================================
  //  TARIFES
  // ============================================================
  function viewTarifes() {
    const nord = db.products.filter(p => p.zone === 'Nord').map(p => {
      const pa = economy.pvp(p.cost_adult, 0.30), pc = economy.pvp(p.cost_child, 0.30);
      return `<tr><td><b>${esc(p.name)}</b></td><td>${p.days}</td><td>${eur(p.cost_adult)}</td><td>${eur(p.cost_child)}</td>
        <td class="clay"><b>${eur(pa)}</b></td><td>${eur(pc)}</td></tr>`;
    }).join('');
    const sud = db.products.filter(p => p.zone === 'Sud').map(p => `<tr><td><b>${esc(p.name)}</b></td><td>${p.days}</td>
      <td colspan="4" class="muted">cost <b>[per definir]</b> — ${p.includes.join(' · ')}</td></tr>`).join('');

    shell('tarifes', `
      <div class="page-head"><div><h1>Tarifes</h1><div class="sub">Tarifa Nord (PVP al 30%) · Sud per definir · <b>cap preu inventat</b></div></div></div>
      <div class="section-title">Nord <small>cost de proveïdor tot inclòs · PVP = cost × 1,30</small></div>
      <div class="card"><table class="tbl">
        <thead><tr><th>Producte</th><th>Dies</th><th>Cost adult</th><th>Cost nen</th><th>PVP adult (30%)</th><th>PVP nen (30%)</th></tr></thead>
        <tbody>${nord}</tbody></table></div>
      <div class="section-title">Sud / Imperials <small>preus pendents de definició amb proveïdor</small></div>
      <div class="card"><table class="tbl">
        <thead><tr><th>Producte</th><th>Dies</th><th colspan="4">Cost</th></tr></thead>
        <tbody>${sud}</tbody></table></div>`);
  }

  // ============================================================
  //  PORTAL CLIENT — accés amb codi
  // ============================================================
  function viewPortalAccess() {
    app().innerHTML = `
      <div class="auth-wrap"><div class="auth-card">
        <div class="logo"><span class="glyph">◈</span> BOUNDLESS</div>
        <div class="tagline">Portal de famílies · Boundless Life</div>
        <div class="field"><label>El teu codi d'accés</label><input id="code" placeholder="BLF-2026-XXX" value="BLF-2026-DEMO"></div>
        <button class="btn block" id="enter">Començar la meva petició</button>
        <div class="demo-hint">L'equip et facilita un codi (caducable / d'un sol ús). Demo: <b>BLF-2026-DEMO</b>.</div>
        <div class="auth-switch">Ets de l'equip? <a href="#/dashboard">Àrea privada →</a></div>
        <div class="auth-by"><span>Amb el suport d'</span><img src="assets/img/logo-aethnic.png" alt="aethnic"></div>
      </div></div>`;
    $('#enter').onclick = () => {
      const code = $('#code').value.trim();
      const ok = db.access_codes.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
      if (!ok) return toast('Codi no vàlid o caducat');
      session.portalCode = code; go('#/portal/wizard');
    };
  }

  // ---- Wizard d'autocotització ----
  const wiz = { step: 0, adults: 2, children: 1, ages: '', tripType: null, dates: '', notes: '' };
  function viewPortalWizard() {
    const tripTypes = [
      { k:'nord-curt', t:'Nord — escapada (1–2 dies)', d:'Tànger, Chefchaouen, Tetouan, Asilah', pid:'p5' },
      { k:'nord-llarg', t:'Nord — complet (3–4 dies)', d:'Diverses ciutats + allotjament', pid:'p7' },
      { k:'sud', t:'Marrakech & Sud (5–9 dies)', d:'Desert, Atles, Essaouira', pid:'p8' },
    ];
    const dots = [0,1,2,3].map(i=>`<div class="ws ${i<=wiz.step?'on':''}"></div>`).join('');
    let body = '';
    if (wiz.step === 0) {
      body = `<h3>Qui viatja?</h3>
        <div class="row" style="margin-top:12px">
          <div class="field"><label>Adults</label><input id="w-adults" type="number" min="1" value="${wiz.adults}"></div>
          <div class="field"><label>Nens</label><input id="w-children" type="number" min="0" value="${wiz.children}"></div>
        </div>
        <div class="field"><label>Edats dels nens</label><input id="w-ages" placeholder="ex. 7, 10" value="${esc(wiz.ages)}"></div>
        <button class="btn block" id="w-next">Continuar</button>`;
    } else if (wiz.step === 1) {
      body = `<h3>Quin tipus de viatge?</h3>
        <div class="choice-grid" style="margin-top:12px">
          ${tripTypes.map(tt=>`<div class="choice ${wiz.tripType===tt.k?'sel':''}" data-k="${tt.k}"><div class="t">${tt.t}</div><div class="d">${tt.d}</div></div>`).join('')}
        </div>
        <button class="btn block" id="w-next" style="margin-top:14px" ${wiz.tripType?'':'disabled'}>Continuar</button>`;
    } else if (wiz.step === 2) {
      body = `<h3>Dates i detalls</h3>
        <div class="field" style="margin-top:12px"><label>Dates aproximades</label><input id="w-dates" placeholder="ex. 14–17 set 2026" value="${esc(wiz.dates)}"></div>
        <div class="field"><label>Alguna cosa més? (al·lèrgies, preferències)</label><textarea id="w-notes" rows="3">${esc(wiz.notes)}</textarea></div>
        <button class="btn block" id="w-next">Veure estimació</button>`;
    } else {
      const tt = tripTypes.find(x=>x.k===wiz.tripType); const p = product(tt.pid);
      const tc = tripCostFor(p, wiz.adults, wiz.children);
      const pvp = tc == null ? null : economy.pvp(tc, 0.30); const pax = wiz.adults + wiz.children;
      body = `<h3>La teva estimació</h3>
        <div class="proposal" style="margin-top:12px;box-shadow:none;padding:18px">
          <div class="ph"><div><h2 style="font-size:20px">${esc(p.name)}</h2><div class="muted">${wiz.adults} adults + ${wiz.children} nens</div></div>
          <div class="right"><div class="muted" style="font-size:12px">des de</div><div class="price-tag">${pvp==null?'a mida':eur(pvp)}</div>${pvp!=null?`<div class="muted" style="font-size:12px">${eur(Math.round(pvp/pax))}/persona</div>`:''}</div></div>
          ${pvp==null?'<p class="muted">Aquest viatge és personalitzat: rebràs una proposta a mida de l\'equip (no inventem el preu).</p>':''}
          <ul class="inc-list">${p.includes.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <button class="btn block" id="w-send" style="margin-top:14px">Enviar la meva petició a BOUNDLESS</button>
        <div class="demo-hint">En enviar, es crea automàticament el teu lead al CRM (origen: portal). El correu segueix sent una alternativa vàlida.</div>`;
    }

    app().innerHTML = `<div class="auth-wrap"><div class="auth-card" style="max-width:460px">
      <div class="logo" style="justify-content:center"><span class="glyph">◈</span> BOUNDLESS</div>
      <div class="tagline">Petició de viatge</div>
      <div class="wizard-steps">${dots}</div>
      ${body}
      ${wiz.step>0 && wiz.step<3 ? '<div class="auth-switch"><a href="#" id="w-back">‹ Enrere</a></div>':''}
    </div></div>`;

    const next = () => { router(); };
    if ($('#w-next')) $('#w-next').onclick = () => {
      if (wiz.step === 0) { wiz.adults=+$('#w-adults').value; wiz.children=+$('#w-children').value; wiz.ages=$('#w-ages').value; }
      if (wiz.step === 2) { wiz.dates=$('#w-dates').value; wiz.notes=$('#w-notes').value; }
      wiz.step++; next();
    };
    $$('.choice').forEach(c => c.onclick = () => { wiz.tripType = c.dataset.k; viewPortalWizard(); });
    if ($('#w-back')) $('#w-back').onclick = (e) => { e.preventDefault(); wiz.step--; next(); };
    if ($('#w-send')) $('#w-send').onclick = () => {
      const id = 'L-' + (200 + db.leads.length);
      db.leads.push({ id, full_name:'Família (portal) '+id, email:'portal.demo@example.com', city_country:'Estepona',
        lang:'EN', status:'New', group_size:wiz.adults+wiz.children, adults:wiz.adults, children:wiz.children, ages:wiz.ages,
        destination: wiz.tripType==='sud'?'Sud':'Nord', start_date:'', duration: wiz.tripType==='nord-curt'?2:wiz.tripType==='nord-llarg'?4:7,
        source:'portal', step:1, assigned:'Kilian', trip_cost:null, closing_budget:null, next_action:'Revisar petició del portal', special_needs:wiz.notes });
      saveDB();
      app().innerHTML = `<div class="auth-wrap"><div class="auth-card center">
        <div class="logo" style="justify-content:center"><span class="glyph">◈</span> BOUNDLESS</div>
        <h2 style="margin:18px 0 8px">Petició rebuda! 🎉</h2>
        <p class="muted">Gràcies. L'equip de BOUNDLESS et contactarà aviat amb la proposta.</p>
        <p class="muted" style="font-size:12.5px;margin-top:10px">(Demo: s'ha creat el lead <b>${id}</b> al CRM amb origen <b>portal</b>.)</p>
        <a href="#/dashboard" class="btn ghost" style="margin-top:16px">Veure-ho al CRM (equip) →</a>
      </div></div>`;
      wiz.step = 0; wiz.tripType = null;
    };
  }

  // ============================================================
  //  INIT
  // ============================================================
  loadDB();
  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
  if (document.readyState !== 'loading') router();
})();

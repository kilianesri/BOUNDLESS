# BOUNDLESS — CRM/ERP (demo)

Aplicació web per a **BOUNDLESS**, la línia de viatges familiars al Marroc.
Aquesta és una **demo en mode test**: frontend autònom (HTML/CSS/JS, sense backend)
amb **només dades fictícies**. El backend real (PHP/MySQL a cdmon) és la Fase 1.

🔗 Publicada via Netlify (desplegament automàtic a cada push).

## Què inclou la demo
**Àrea d'equip** (login demo — qualsevol credencial entra):
- **Tauler** — KPIs (leads, conversió, comissió total, part Kilian) + tasques pendents.
- **Leads / CRM** — kanban de 6 estats amb protocol de 6 passos.
- **Fitxa de lead** — dades editables, seguiment, bloc d'economia en viu i fil de correu.
- **Safata Gmail** — correus etiquetats "4.03.01. BOUNDLESS" amb camps extrets i esborrany.
- **Propostes + generador** — preu en viu i vista prèvia (CA/ES/EN).
- **Proveïdors** — BBDD de cotitzacions amb desglossament.
- **Tarifes** — Nord (PVP al 30%) i Sud (`[per definir]`).

**Portal de client** (accés amb codi, demo `BLF-2026-DEMO`):
- Wizard d'autocotització → estimació instantània → crea el lead al CRM (origen=portal).

## Model econòmic (`assets/js/economy.js`)
```
PVP = Cost × (1 + marge)   ·   Comissió = PVP − Cost
Split: Boundless 20% · TURISCOOP·AETHNIC 40% · Kilian 40%
Objectiu 320–340 €/pax (només viatges multi-dia)
```
**Cap preu inventat**: els productes del Sud tenen el cost a `null` fins definir-lo.

## Estructura
```
index.html              Shell de l'app
assets/css/styles.css   Sistema de disseny (terracota/sorra/oliva, Fraunces+Outfit)
assets/js/economy.js    Model econòmic (funcions reutilitzables)
assets/js/data.js       Dades d'exemple (fictícies)
assets/js/app.js        SPA (routing + totes les pantalles)
```

## Seguretat
`.env`, claus i credencials estan exclosos per `.gitignore` i mai s'han de pujar.
La demo pública només conté dades d'exemple, mai clients reals.

# BOUNDLESS

Projecte BOUNDLESS — CRM / app web.

## Fase 0
- `index.html` — pàgina pública (de moment, placeholder; se substituirà pel prototip real).
- Desplegament continu: cada `push` a la branca de producció es publica automàticament a Netlify.

## Estructura
| Fitxer | Descripció |
|---|---|
| `index.html` | Pàgina d'entrada pública |
| `.gitignore` | Exclou `.env`, claus i credencials del control de versions |

## Seguretat
Mai s'han de pujar fitxers `.env`, claus (`*.pem`, `*.key`) ni credencials. El `.gitignore` ja els exclou.

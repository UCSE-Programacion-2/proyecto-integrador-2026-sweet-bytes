# Proyecto Integrador 2026 - Equipo: Sweet Bytes

**Tablero de GitHub Projects:** [https://github.com/orgs/UCSE-Programacion-2/projects/33/]

## 👥 Integrantes (Sweet Bytes)
* **Segovia, Santiago Leonardo Uriel** - [PibeManopla1](https://github.com/PibeManopla1)
* **Reynaga Ducos, Mariano** - [marianrd](https://github.com/marianrd)
* **Castillo, Matias** - [matiascastillo2005-glitch](https://github.com/matiascastillo2005-glitch)

## 🏢 Cliente Real Elegido 
* **Nombre del Negocio:** Freddy Bakes
* **Rubro:** Pasteleria y Reposteria
* **Justificación:** El negocio cuenta con un catálogo dinámico de alta rotación. La variabilidad de precios y atributos (stock, categoría) exige la digitalización mediante un CRUD para que el panel administrativo refleje cambios en tiempo real.

## 📝 Reglas de Contribución
* Uso de Git Flow.
* PRs requieren al menos 1 aprobación (equipo de 3 integrantes).
* No se acepta código sin Issue asociada.
* Guía para alumnos (commits y protecciones de PR): `docs/como-ejecutar.md` (sección "Guía para alumnos: commits y PRs").

## 📹 Sprint Review (todos los sprints)
* Guía unificada: `docs/sprint-review/README.md`
* Plantilla para equipos: `docs/sprint-review/sprint-review-template.md`
* Rúbrica de evaluación: `docs/sprint-review/sprint-review-rubrica.md`
* Checklist estudiantes: `docs/sprint-review/sprint-review-checklist-estudiantes.md`
* Checklist docentes: `docs/sprint-review/sprint-review-checklist-docentes.md`

## 🚀 Deploy y evidencias (Sprint 4)
* **URL de Producción Frontend:** https://subahibi.duckdns.org
* **URL de Producción Backend:** https://subahibi.duckdns.org/api (por ejemplo `/api/products`)
* **Video de respaldo (Sprint 0):** [Link a Loom/Youtube/Drive] Aun no lo tenemos..

### Stack final
* **Frontend:** React 18 + Vite + React Router (`frontend/frontend-react`)
* **Backend:** Node.js + Express + MongoDB/Mongoose (`backend`)
* **Infraestructura propia (un solo VPS):** Caddy (HTTPS automático, sirve el frontend y reenvía `/api/*`), backend como servicio systemd y MongoDB en un contenedor Docker.

### Variables de entorno
| Servicio | Variable | Descripción |
| --- | --- | --- |
| Backend | `MONGODB_URI` | Cadena de conexión de MongoDB |
| Backend | `FRONTEND_URL` | Orígenes permitidos por CORS (separados por coma) |
| Backend | `NODE_ENV` | `production` en el servidor |
| Backend | `PORT` | Puerto del servicio (4000) |
| Frontend | `VITE_API_URL` | URL de la API sin `/` final; vacía si Caddy reenvía `/api/*` en el mismo dominio |

Para desarrollo local copiá `backend/.env.example` y `frontend/frontend-react/.env.example` a `.env`.

### Cómo desplegar
1. **Backend:** copiar `backend/` a `/opt/freddybakes-backend`, instalar con `npm ci --omit=dev`, definir las variables en `/etc/freddybakes/backend.env` (solo lectura para el servicio) y arrancar la unidad systemd `freddybakes-backend`, que ejecuta `node server.js` con un usuario sin privilegios.
2. **Frontend:** `cd frontend/frontend-react && VITE_API_URL= npm run build` y copiar `dist/` al directorio que sirve Caddy (`/var/www/freddybakes`).
3. **Caddy:** sitio del dominio con `root` en ese directorio, `try_files {path} /index.html` para la SPA y `handle /api/*` con `reverse_proxy 127.0.0.1:4000`. Al compartir dominio, el navegador no necesita CORS.
4. Si el frontend se publica en otra plataforma (Vercel, Netlify), `vercel.json` y `public/_redirects` ya redirigen todas las rutas a `/index.html`; en ese caso hay que definir `VITE_API_URL` y `FRONTEND_URL`.

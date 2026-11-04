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
* **URL de Producción Backend:** https://freddybakes.onrender.com
* **Video de respaldo (Sprint 0):** [Link a Loom/Youtube/Drive] Aun no lo tenemos..

### Stack final
* **Frontend:** React 18 + Vite + React Router (`frontend/frontend-react`)
* **Backend:** Node.js + Express + MongoDB/Mongoose (`backend`)
* **Deploy:** Render (API), MongoDB propio accesible desde la nube y un VPS con Caddy (frontend estático con HTTPS)

### Variables de entorno
| Servicio | Variable | Descripción |
| --- | --- | --- |
| Backend | `MONGODB_URI` | Cadena de conexión de MongoDB |
| Backend | `FRONTEND_URL` | Orígenes permitidos por CORS (separados por coma); solo hace falta si el frontend llama a la API desde otro dominio |
| Backend | `NODE_ENV` | `production` en la nube |
| Frontend | `VITE_API_URL` | URL de la API sin `/` final; vacía si Caddy reenvía `/api/*` al backend (mismo origen) |

Para desarrollo local copiá `backend/.env.example` y `frontend/frontend-react/.env.example` a `.env`.

### Cómo desplegar
1. **Backend (Render):** Web Service con root `backend`, build `npm install`, start `npm start`; configurar `MONGODB_URI` y `NODE_ENV=production`.
2. **Frontend:** `cd frontend/frontend-react && VITE_API_URL= npm run build` y copiar `dist/` al directorio que sirve el servidor web (por ejemplo `/var/www/freddybakes`).
3. **Caddy:** sitio con `root` en ese directorio, `try_files {path} /index.html` para la SPA y `handle /api/*` con `reverse_proxy` al backend de Render (`header_up Host {upstream_hostport}`), de modo que el navegador solo habla con el dominio del frontend y no hay CORS.
4. Si el frontend se publica en otra plataforma (Vercel, Netlify), `vercel.json` y `public/_redirects` ya redirigen todas las rutas a `/index.html`; en ese caso hay que definir `VITE_API_URL` y `FRONTEND_URL`.

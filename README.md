# Marqués — Restaurant Web

Frontend del sistema de reservas de **Restaurante Marqués**, una web de alta cocina con reserva de mesa online, carta digital, gestión de reseñas y panel de administración.

Este repositorio **no es un ejercicio aislado**: es la mitad cliente de un sistema full-stack completo. Consume íntegramente la API REST de [**restaurant-api**](https://github.com/pablo-redondo/restaurant-api) — autenticación JWT, disponibilidad de mesas, ciclo de vida de reservas y reseñas — y no tiene lógica de negocio propia ni base de datos local. Ambos repos se despliegan de forma independiente y se comunican en producción vía HTTPS.

```
┌─────────────────────┐        HTTPS / REST + JWT        ┌──────────────────────┐
│   restaurant-web      │ ───────────────────────────────▶ │   restaurant-api       │
│   Next.js 14 (App)    │ ◀─────────────────────────────── │   Express + PostgreSQL │
│   Vercel               │           JSON                    │   Render                │
└─────────────────────┘                                    └──────────────────────┘
```

## 🔗 Demo en vivo

| | |
|---|---|
| **Web** | [restaurant-web-lilac.vercel.app](https://restaurant-web-lilac.vercel.app) |
| **API** | [restaurant-api-v5rh.onrender.com](https://restaurant-api-v5rh.onrender.com) |
| **Docs de la API (Swagger)** | [restaurant-api-v5rh.onrender.com/api-docs](https://restaurant-api-v5rh.onrender.com/api-docs) |
| **Repo del backend** | [github.com/pablo-redondo/restaurant-api](https://github.com/pablo-redondo/restaurant-api) |

> La API corre en el plan gratuito de Render y "duerme" tras un rato de inactividad: la primera petición tras un periodo sin uso puede tardar unos segundos (cold start) mientras el contenedor arranca.

## 📸 Capturas

<!--
  TODO: sustituir por capturas reales antes de compartir el repo como parte del portfolio.
  Sugerencia de tamaño: 1280×800, formato WebP/PNG, guardadas en docs/screenshots/.
-->

| Home | Carta |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Carta](docs/screenshots/carta.png) |

| Reservar mesa | Panel de administración |
|---|---|
| ![Reservar mesa](docs/screenshots/reservations.png) | ![Admin](docs/screenshots/admin.png) |

## ✨ Features

**Público**
- Home, Carta, Nosotros y Contacto con contenido editorial y animaciones de scroll.
- Flujo de reserva en 3 pasos (fecha/hora → mesa disponible → confirmación), con comprobación de disponibilidad en tiempo real contra la API.
- Registro / inicio de sesión con JWT persistido en `localStorage`.
- "Mis reservas": listado, filtro por estado, detalle, cancelación.
- Reseñas verificadas: solo puede reseñar quien tuvo una reserva confirmada; una reseña por reserva (reforzado también en la API).
- Diseño responsive (móvil, tablet, escritorio) con menú de navegación adaptado a cada tamaño.

**Panel de administración** (`/admin`, protegido por rol)
- Dashboard con ocupación, reservas del día y pendientes de confirmar.
- Gestión de reservas (filtros, cambio de estado).
- Gestión de mesas (alta, activar/desactivar por zona).
- Moderación de reseñas.

## 🛠 Stack

- **[Next.js 14](https://nextjs.org/)** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para estilos
- **JWT** guardado en `localStorage`, adjuntado como `Authorization: Bearer` en cada petición a la API
- Consumo de API vía `fetch` con un cliente propio (`src/lib/api.ts`), sin librerías de data-fetching de terceros
- Desplegado en **Vercel**; la API en **Render**

El backend (**[restaurant-api](https://github.com/pablo-redondo/restaurant-api)**) está construido con Node.js, Express, TypeScript, PostgreSQL, autenticación JWT, validación con `express-validator`, rate limiting y documentación Swagger — con su propia suite de tests.

## 🚀 Empezar en local

### Requisitos

- Node.js 18+
- La [API](https://github.com/pablo-redondo/restaurant-api) corriendo en local (o apuntar a la de producción, ver siguiente sección)

### Instalación

```bash
git clone https://github.com/pablo-redondo/restaurant-web.git
cd restaurant-web
npm install
cp .env.example .env.local
npm run dev
```

La web queda disponible en [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Linter (ESLint + reglas de Next.js) |

## 🔌 Cómo se conecta con la API

Toda la comunicación con el backend pasa por una única variable de entorno:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000   # API en local
# NEXT_PUBLIC_API_URL=https://restaurant-api-v5rh.onrender.com   # API en producción
```

Al ser una variable `NEXT_PUBLIC_*`, se incluye en el bundle del cliente — el navegador llama directamente a la API, no hay proxy ni API routes intermedias en este repo. Si no se define, `src/lib/api.ts` cae por defecto a `http://localhost:3000`.

Para desarrollar contra la API local:
1. Clona y arranca [restaurant-api](https://github.com/pablo-redondo/restaurant-api) (por defecto en `http://localhost:3000`).
2. Deja `NEXT_PUBLIC_API_URL` sin definir, o apúntala explícitamente a esa URL.
3. Arranca este proyecto con `npm run dev`.

Para probar contra la API real desplegada en Render, usa la URL de producción de arriba — es la misma API que usa la demo en vivo.

## 📁 Estructura del proyecto

```
src/
├── app/                  # Rutas (App Router): páginas públicas, auth, reservas, /admin
├── components/           # Componentes UI reutilizables
├── context/              # AuthContext (sesión, login/registro/logout)
├── lib/api.ts            # Cliente HTTP hacia restaurant-api (fetch + JWT)
└── types/                # Tipos compartidos (User, Reservation, Table, Review...)
```

## ☁️ Despliegue

- **Frontend**: Vercel, despliegue automático desde `main`. La variable `NEXT_PUBLIC_API_URL` se define en la configuración del proyecto en Vercel (ver `vercel.json`) apuntando a la API en Render.
- **Backend**: Render, despliegue automático desde `main` de [restaurant-api](https://github.com/pablo-redondo/restaurant-api). Un workflow de GitHub Actions (`.github/workflows/keepalive.yml`) hace ping periódico a `/health` para mitigar el cold start del plan gratuito.

## 📄 Licencia

Proyecto personal con fines de portfolio.

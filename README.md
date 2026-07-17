# IO2 Suministros

MVP de Teoría de Colas (M/M/s) para la distribución de suministros vitales en centros de acopio post-sismo. Proyecto de Investigación de Operaciones II — UNET.

## Requisitos

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) y Docker Compose

## Arranque rápido

```bash
npm install
npm run docker:up
npm run dev
```

Abre **http://localhost:5173** en tu navegador.

La base de datos PostgreSQL y la API se levantan automáticamente con Docker Compose. Los datos dummy (6 escenarios pre-cargados) están listos al iniciar.

## Scripts disponibles

| Comando              | Descripción                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Inicia el frontend con Vite (http://localhost:5173) |
| `npm run build`      | Compila TypeScript y genera el build de producción |
| `npm run docker:up`  | Levanta PostgreSQL + API en segundo plano        |
| `npm run docker:down`| Detiene y elimina los contenedores               |
| `npm run start`      | `docker:up` + `dev` (arranque completo)          |
| `npm run lint`       | Ejecuta el linter (oxlint)                       |

## Arquitectura

```
navegador (:5173)  →  Vite (React + Tailwind)
                         │
                         ▼  fetch a :54321
                    API Express (:3000 en Docker)
                         │
                         ▼
                    PostgreSQL (:5432)
```

El cliente Supabase JS apunta a `http://localhost:54321` (configurado en `.env`). La API Express emula el formato de respuesta de PostgREST/Supabase, por lo que el código del frontend funciona igual contra un Supabase real o contra el entorno local.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend local:** Express + PostgreSQL 16 (Docker)
- **Cliente API:** @supabase/supabase-js (conecta contra la API local o Supabase Cloud)
- **Routing:** React Router 7

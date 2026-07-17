# Backend - Objetos Perdidos (Campus)

API REST en Node.js + Express para el sistema de objetos perdidos del campus:
catálogo de objetos encontrados, reclamos de alumnos y gestión de usuarios.
Sigue la misma arquitectura usada en clase (`route → middleware → controller →
service → repository → model`, con Sequelize + PostgreSQL).

> **Estado actual:** el código está listo para conectarse a una base de datos,
> pero la base de datos todavía **no ha sido creada**. Sigue los pasos de
> "Puesta en marcha" cuando quieras conectarla.

## Stack
- Node con ESM (`"type": "module"`)
- Express 5
- Sequelize + pg (PostgreSQL)
- jsonwebtoken, bcryptjs
- body-parser, cors, dotenv
- nodemon en dev

## Arquitectura

```
backend/
├── app.js                      # configura Express y monta los routers
├── index.js                    # bootstrap: conecta BD y levanta el servidor
└── src/
    ├── config/
    │   └── database.js         # conexión Sequelize (usa variables de entorno)
    ├── routes/                 # routers Express (uno por dominio)
    │   ├── usuario.js
    │   ├── objeto.js
    │   └── reclamo.js
    ├── controllers/            # parsean req/res, delegan al service
    ├── services/                # lógica de negocio
    ├── repositories/           # acceso a datos (findAll, findOne, create, update, remove)
    ├── models/                 # definiciones Sequelize
    ├── middleware/
    │   └── auth.js             # authMiddleware (JWT) + adminMiddleware
    └── data/
        └── migrate.js          # script de seed (crea tablas + datos de ejemplo)
```

### Convenciones
- Cada repositorio expone `findAll`, `findOne`, `create`, `update`, `remove` (heredado de `RepositoryBase`) más métodos específicos por dominio.
- Los services devuelven `{ success, message, ...payload }`; los controllers eligen el status code según `success`.
- Los usuarios se sanitizan (`sanitize()`) antes de responder, para no exponer `password`.
- IDs autoincrementales gestionados por Postgres/Sequelize.

## Puesta en marcha

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env` y completa los valores (connection string de tu Postgres, o las variables `DB_*` para uno local; además `JWT_SECRET`).
3. Crea las tablas y carga datos de ejemplo:
   ```bash
   npm run migrate
   ```
4. Levanta el servidor:
   ```bash
   npm run dev    # nodemon
   npm start      # producción
   ```
   Puerto por defecto: **3006** (configurable con `PORT`).

## Autenticación / Autorización
- `authMiddleware` lee `Authorization: Bearer <token>` y carga `req.usuario = { id, codigo, nombre, rol }`.
- `adminMiddleware` requiere `req.usuario.rol === 'admin'` → 403 si no.
- Los reclamos bloquean explícitamente al admin (`bloquearAdmin` en `routes/reclamo.js`) — el admin no reclama objetos, solo los resuelve.

## Endpoints

### Auth (`/auth`)
- `POST /auth/registrar` — `{ codigo, nombre, password, rol? }` → crea usuario (`rol` por defecto `'student'`).
- `POST /auth/login` — `{ codigo, password, rol }` → `{ token, usuario }`. Falla si el rol no coincide o la cuenta está inactiva.
- `GET /auth/usuarios` (admin) — lista usuarios con `totalReclamos` y `aprobados`.
- `PUT /auth/usuarios/:id/acceso` (admin) — activa/desactiva el acceso del usuario.

### Objetos (`/objeto`)
- `GET /objeto` — público, catálogo completo.
- `GET /objeto/:id` — público.
- `POST /objeto` (admin) — `{ nombre, categoria, descripcion, icono }`.
- `PUT /objeto/:id` (admin) — edita cualquiera de esos campos.
- `DELETE /objeto/:id` (admin).

### Reclamos (`/reclamo`, requiere auth)
- `GET /reclamo` (admin) — reclamos pendientes.
- `GET /reclamo/mios` (alumno) — mis reclamos.
- `POST /reclamo` (alumno) — `{ objetoId, evidencia }`. Falla si el objeto ya no está disponible.
- `PUT /reclamo/:id/resolver` (admin) — `{ aprobado: boolean }`. Si se aprueba, el objeto pasa a `estado: 'reclamado'`.

## Modelo de datos

### Usuario
`{ id, codigo, nombre, password (bcrypt), rol: 'admin' | 'student', activo }`

### Objeto
`{ id, nombre, categoria, descripcion, icono, estado: 'disponible' | 'reclamado' }`

### Reclamo
`{ id, objetoId, usuarioId, evidencia, estado: 'pendiente' | 'aprobado' | 'rechazado' }`

Las respuestas de reclamos vienen enriquecidas con `objetoNombre` y `alumnoCodigo`
(se resuelven en el service consultando los repos de objeto y usuario).

## Usuarios semilla (`npm run migrate`)
| Código      | Password | Rol     | Activo |
|-------------|----------|---------|--------|
| admin       | admin    | admin   | sí     |
| 20231456    | 1234     | student | sí     |
| 20220890    | 1234     | student | sí     |
| 20210055    | 1234     | student | no     |

## Pendiente / próximos pasos
- Conectar el frontend a estos endpoints (reemplazar el estado local de `App.jsx` por llamadas `fetch`/`axios` a esta API).
- Crear la base de datos real y ejecutar `npm run migrate` contra ella.
- Definir `JWT_SECRET` seguro en el entorno de despliegue.

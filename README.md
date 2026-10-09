# API de Tareas — NestJS + React

Proyecto académico para demostrar una API HTTP validada con NestJS y una interfaz React que consume su contrato.

## Tecnologías

- Backend: NestJS, TypeScript, class-validator, Swagger/OpenAPI
- Frontend: React + Vite
- Datos: memoria (sin base de datos)

## Estructura

```text
api-tareas-nest-react/
├── backend/
└── frontend/
```

## Requisitos

- Node.js 18+
- npm

## 1. Ejecutar backend

```bash
cd backend
npm install
npm run start:dev
```

Backend disponible en:

```text
http://localhost:3000
```

Documentación OpenAPI/Swagger:

```text
http://localhost:3000/api/docs
```

## 2. Ejecutar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

El backend permite CORS únicamente para `http://localhost:5173`.

## Rutas de la API

Recurso: `/tasks`

| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| GET | `/tasks` | Lista todas las tareas | 200 |
| GET | `/tasks/:id` | Obtiene una tarea | 200 |
| POST | `/tasks` | Crea una tarea | 201 |
| PATCH | `/tasks/:id` | Modifica parcialmente una tarea | 200 |
| DELETE | `/tasks/:id` | Elimina una tarea | 204 |

## Validación

La API utiliza `ValidationPipe` global con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Campos de una tarea:

- `title`: obligatorio, texto, entre 3 y 80 caracteres.
- `description`: opcional, texto, máximo 200 caracteres.
- `completed`: opcional, booleano.

Si se envía una propiedad desconocida, la API responde `400 Bad Request`.

## Códigos HTTP utilizados

- `200 OK`: consultas y actualización exitosa.
- `201 Created`: creación exitosa.
- `204 No Content`: eliminación exitosa.
- `400 Bad Request`: datos inválidos o propiedades desconocidas.
- `404 Not Found`: tarea inexistente.
- `409 Conflict`: intento de crear una tarea con un título ya existente.

No se fabrica deliberadamente ningún error `500`.

## Ejemplo POST válido

```json
{
  "title": "Estudiar NestJS",
  "description": "Repasar controladores y DTO",
  "completed": false
}
```

## Ejemplo inválido

```json
{
  "title": "A",
  "extra": "no permitido"
}
```

La API devuelve `400 Bad Request`.

## Video

Antes de entregar, agregar al PDF el enlace público o de solo visualización al video de Google Drive.

## GitHub

Antes de entregar, publicar este proyecto en un repositorio público y agregar aquí el enlace.

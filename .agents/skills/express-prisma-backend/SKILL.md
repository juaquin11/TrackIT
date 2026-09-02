---
name: express-prisma-backend
description: >-
  Guía de arquitectura y mejores prácticas para el backend de TrackIT usando Node.js, Express,
  TypeScript y Prisma ORM con PostgreSQL.
---

# Express + Prisma Backend Guidelines

Esta skill proporciona pautas y patrones de diseño para construir el backend de TrackIT.

## Arquitectura por Capas

1. **Routes (`/src/routes`)**: Definición de endpoints RESTful con Express Router.
2. **Controllers (`/src/controllers`)**: Captura de peticiones HTTP, validación de inputs y formateo de respuestas.
3. **Services (`/src/services`)**: Lógica de negocio pura de la aplicación.
4. **Prisma Client (`/src/prisma`)**: Acceso y consultas a la base de datos PostgreSQL.
5. **Middlewares (`/src/middlewares`)**: Manejo de errores globales, autenticación/autorización y validaciones de schemas.

## Prisma & PostgreSQL

- **Schema**: Definido en `prisma/schema.prisma`.
- **Integridad Referencial**: Usar relaciones con `onDelete` (ej. `Cascade` o `SetNull`) adecuadamente.
- **Tipado**: Aprovechar los tipos generados automáticamente por Prisma (`@prisma/client`).
- **Migraciones**: Ejecutar `npx prisma migrate dev` para sincronizar cambios en desarrollo.

## Buenas Prácticas TypeScript + Express

- Usar `zod` o `express-validator` para validar payloads de entrada.
- Manejo centralizado de errores con un middleware personalizado.
- Respuestas HTTP estandarizadas: `{ success: boolean, data?: any, error?: string }`.

---
name: trackit-domain-model
description: >-
  Modelo de dominio y esquema de base de datos para TrackIT: Perfil de Usuario, Catálogo de Alimentos, Etiquetas, Historial Diario y Alimentos Consumidos.
---

# TrackIT Domain Model & Database Schema

Esta skill describe las entidades del sistema y el esquema de Prisma ORM para PostgreSQL.

## Entidades y Tablas

### 1. Usuario (`User`)
- `id`: Int Autoincremental (PK)
- `pesoKg`: Float
- `alturaCm`: Float
- `edad`: Int
- `factorActividad`: Float
- `objetivo`: String ("Volumen", "Definicion", "Mantenimiento", "Recomposicion")

### 2. Alimento (`Food`)
- `id`: Int Autoincremental (PK)
- `nombre`: String
- `porcionBase`: Float (default 100g)
- `calorias`: Float
- `proteinas`: Float
- `carbohidratos`: Float
- `grasas`: Float
- `tags`: Relación N:M con `Tag`
- `consumptions`: Relación 1:N con `ConsumedFood`

### 3. Etiqueta (`Tag`)
- `id`: Int Autoincremental (PK)
- `name`: String (Único, ej. "fuente_proteina", "keto", "desayuno")
- `foods`: Relación N:M con `Food`

### 4. Historial Diario (`DailyRecord`)
- `id`: Int Autoincremental (PK)
- `fecha`: DateTime (`@db.Date`, Único)
- `foods`: Relación 1:N con `ConsumedFood`

### 5. Alimento Consumido (`ConsumedFood`)
- `id`: Int Autoincremental (PK)
- `gramos`: Float
- `foodId`: FK a `Food`
- `recordId`: FK a `DailyRecord`

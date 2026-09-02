---
name: react-vite-pwa
description: >-
  Guía de desarrollo para el frontend de TrackIT utilizando React, Vite, TypeScript y soporte PWA (Progressive Web App).
---

# React + Vite + PWA Frontend Guidelines

Esta skill define la arquitectura, el diseño UI/UX y la configuración PWA para la aplicación web de TrackIT.

## Configuración PWA

- **Manifest**: Archivo `manifest.webmanifest` o configurado vía `vite-plugin-pwa`.
- **Iconos**: Definir iconos responsivos (192x192, 512x512, maskable) para instalación en pantalla de inicio.
- **Service Worker**: Cacheo de assets estáticos y estrategias offline para el registro de alimentos/historial diario.

## Diseño y Estilo UI/UX

- **Aesthetic**: Interfaz oscura/moderna, limpia y altamente responsiva para móviles y escritorio.
- **Estilos**: CSS modular / Vanilla CSS estructurado con variables globales (`:root`) para temas y tokens de diseño.
- **Micro-interacciones**: Transiciones suaves para botones, modales y gráficos de consumo nutrimental.

## Estructura de Componentes React (TypeScript)

- `/src/components`: Componentes UI reutilizables (Botones, Inputs, Cards, Modales, Badges).
- `/src/features`: Módulos principales (HistorialDiario, Alimentos, Etiquetas, ResumenNutricional).
- `/src/hooks`: Custom React hooks para lógica reutilizable y fetching.
- `/src/services`: Adaptadores de API para comunicación con el backend Express.

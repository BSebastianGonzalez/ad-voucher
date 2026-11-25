# Comprobantes por WhatsApp — AdrianaDigital

PWA móvil-primero para armar comprobantes de venta informales en segundos y enviarlos por WhatsApp sin backend ni costos de infraestructura.

## Requisitos

- Node.js 20+ y npm 10+

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre la URL local en el navegador (en móvil o modo responsivo de `360 px` para probar el diseño).

## Pruebas unitarias

```bash
npm test
```

Las pruebas cubren la lógica de dominio (`src/domain/`) y almacenamiento local (`src/storage/`):
- Normalización y validación de celulares colombianos (`57` + 10 dígitos)
- Formateo y parseo de pesos colombianos en enteros (`$25.000`)
- Cálculo de subtotales y totales de venta
- Renderizado de plantilla y codificación de enlace `https://wa.me/`
- Persistencia y restauración de saludo y despedida en `localStorage`

## Compilación de producción (PWA)

```bash
npm run build
npm run preview
```

Genera la carpeta `dist/` con `manifest.webmanifest`, `sw.js` e íconos instalables para funcionar offline.

## Despliegue gratuito (hosting estático)

- **Vercel / Netlify:** Conectar el repositorio, usar `npm run build` como comando de build y `dist` como directorio de salida.
- **GitHub Pages:** Publicar el contenido de `dist/` tras ejecutar `npm run build`.

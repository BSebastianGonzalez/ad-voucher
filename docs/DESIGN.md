# DESIGN.md — Comprobantes por WhatsApp (AdrianaDigital)

Guía de diseño de la app. Complementa a `AGENTS.md`: allá está **qué** hace la app; aquí, **cómo se ve**. Ante cualquier duda visual, este archivo manda.

## 1. Principios

- **Móvil primero.** Se usa de pie, con una mano, atendiendo clientes. Todo debe alcanzarse con el pulgar.
- **Limpia y rápida.** Pocas cosas en pantalla; el camino de venta a envío debe sentirse corto.
- **Fiel a la marca.** Azul, rosado y azul marino del logo; estilo moderno y tecnológico, pero amable.
- **Legible antes que decorada.** Si un adorno estorba la lectura, se quita.

## 2. Logo y header

El logo de AdrianaDigital (letra "A" azul con cinta rosada de código binario, y debajo "ADRIANA" en azul marino y "DIGITAL" en rosado) va **centrado en el header**.

### Especificaciones del header

```
┌──────────────────────────────────────┐
│  [      ]        ◆ LOGO ◆       [⚙]  │   ← 64 px de alto, fondo blanco
├──────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   ← línea degradada 3 px (cian → azul → rosado)
└──────────────────────────────────────┘
```

- Alto: **64 px**, fondo **blanco**, fijo arriba (`sticky`).
- Logo **centrado de verdad**: estructura de tres columnas (`1fr auto 1fr`). A la izquierda un espacio vacío del mismo ancho que el botón de ajustes a la derecha, para que el logo no se corra.
- Logo: alto de **44 px** (altura de la imagen recortada), ancho automático, sin deformar.
- Botón de ajustes (⚙) a la derecha, área táctil de 48×48 px.
- Debajo del header, una línea de **3 px con degradado** `cian → azul → rosado`, que recuerda la cinta del logo.
- Respetar el área de seguridad del teléfono (`env(safe-area-inset-top)`).

### Uso del logo
- Archivo: `src/assets/logo.svg` (preferido) o `logo.png` con **fondo transparente**. Si solo hay PNG con fondo blanco, el header es blanco y se recortan los márgenes sobrantes.
- No recolorear, no estirar, no agregar sombras ni efectos, no redibujar.
- Texto alternativo: `AdrianaDigital`.
- Dejar un margen libre alrededor equivalente a la altura de la "D" de "DIGITAL".
- El logo aparece **solo en el header**; no se repite en otras zonas de la pantalla.

## 3. Paleta de colores

Los colores salen del logo. Son valores aproximados tomados de la imagen; si existe el archivo vectorial original, ajustar con el selector de color y actualizar esta tabla.

### Marca

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-navy` | `#1C2377` | Texto del logo, títulos, botón principal |
| `--color-blue` | `#1E88E5` | Enlaces, foco, elementos activos |
| `--color-cyan` | `#29B6F6` | Acentos y degradados |
| `--color-pink` | `#F06292` | Acentos decorativos, íconos, detalles |
| `--color-pink-dark` | `#C2185B` | Rosado cuando se usa como **texto** o borde de error |

### Neutros

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#F6F8FC` | Fondo de la app |
| `--color-surface` | `#FFFFFF` | Tarjetas, header, campos |
| `--color-border` | `#E3E8F2` | Bordes y divisores |
| `--color-text` | `#1A1F36` | Texto principal |
| `--color-text-muted` | `#5B6478` | Texto secundario, etiquetas, placeholders |

### Estados

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#2E9E6B` | Confirmaciones |
| `--color-error` | `#C62828` | Errores de validación |
| `--color-warning` | `#B26A00` | Avisos |

### Degradado de marca
```css
--gradient-brand: linear-gradient(90deg, #29B6F6 0%, #1E88E5 50%, #F06292 100%);
```
Solo para la línea del header y detalles puntuales. **No** usarlo como fondo de bloques grandes ni de botones.

### Reglas de color
- Proporción: **~70 % neutros, ~20 % azul marino/azul, ~10 % rosado**.
- El rosado `#F06292` **no se usa como texto pequeño sobre blanco** (contraste insuficiente). Para texto rosado usar `--color-pink-dark`.
- Contraste mínimo: **4.5:1** para texto normal, **3:1** para texto grande e íconos.
- Nunca comunicar un estado solo con color: acompañar con ícono o texto.

## 4. Tipografía

El logo usa una sans-serif geométrica y limpia. La app sigue esa línea.

| Rol | Fuente | Respaldo |
|-----|--------|----------|
| Títulos | **Poppins** (600) | `system-ui, sans-serif` |
| Texto e inputs | **Inter** (400, 500) | `system-ui, sans-serif` |

- Las fuentes se **instalan localmente** (por ejemplo `@fontsource/poppins` y `@fontsource/inter`), no desde un CDN, para que funcionen sin conexión.
- Cargar solo los pesos usados.

### Escala

| Nivel | Tamaño | Peso | Uso |
|-------|--------|------|-----|
| Título de pantalla | 22 px | 600 | "Nueva venta" |
| Subtítulo de sección | 16 px | 600 | "Productos" |
| Texto | 16 px | 400 | Campos y contenido |
| Etiqueta | 14 px | 500 | Labels sobre los campos |
| Ayuda / error | 13 px | 400 | Mensajes bajo los campos |
| Total | 20 px | 600 | Monto total |

- El tamaño base de los campos es **16 px o más**: evita el zoom automático de iOS al enfocar un input.
- Interlineado: 1.5 en texto, 1.25 en títulos.

## 5. Espaciado, forma y elevación

- Cuadrícula base de **4 px**. Escala: `4 · 8 · 12 · 16 · 24 · 32`.
- Margen lateral de pantalla: **16 px**.
- Separación entre secciones: **24 px**. Entre campos: **12 px**.
- Radios: campos y botones `12 px`, tarjetas `16 px`, burbuja de vista previa `16 px`.
- Sombras suaves, solo en tarjetas y barra inferior: `0 2px 8px rgba(28, 35, 119, 0.08)`.
- Bordes de 1 px en `--color-border`. Nada de sombras pesadas ni bordes gruesos.

## 6. Layout

- Una sola columna. Diseño base para **360–430 px** de ancho.
- En pantallas anchas, el contenido se limita a **480 px** y se centra; el fondo sigue siendo `--color-bg`.
- Estructura de toda pantalla:

```
┌──────────────────────────┐
│ HEADER (logo centrado)   │  fijo
├──────────────────────────┤
│                          │
│  CONTENIDO               │  con scroll
│                          │
├──────────────────────────┤
│ BARRA DE ACCIÓN INFERIOR │  fija, con el botón principal
└──────────────────────────┘
```

- La **barra inferior** es fija, con fondo blanco, sombra suave y respeta `env(safe-area-inset-bottom)`. Allí vive siempre la acción principal.
- El contenido deja espacio inferior suficiente para que la barra no tape el último campo.

## 7. Pantallas

### 7.1 Nueva venta (pantalla principal)

```
┌──────────────────────────────┐
│          ◆ LOGO ◆        [⚙] │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                              │
│  Nueva venta                 │
│                              │
│  Cliente                     │
│  Nombre                      │
│  ┌────────────────────────┐  │
│  │ Carlos Pérez           │  │
│  └────────────────────────┘  │
│  Celular                     │
│  ┌────────────────────────┐  │
│  │ 300 123 4567           │  │
│  └────────────────────────┘  │
│                              │
│  Productos                   │
│  ┌────────────────────────┐  │
│  │ Producto A             │  │
│  │ Cant [2]   Precio $10.000 🗑│
│  └────────────────────────┘  │
│  [ + Agregar producto ]      │
│                              │
│  Total             $20.000   │
│                              │
├──────────────────────────────┤
│   [  Ver mensaje  ]          │
└──────────────────────────────┘
```

- Secciones en tarjetas blancas sobre fondo `--color-bg`: **Cliente** y **Productos**.
- Cada producto es una fila-tarjeta con nombre, cantidad, precio y botón de eliminar.
- "Agregar producto" es un botón secundario de ancho completo.
- El **total** se actualiza en vivo y siempre está visible encima de la barra inferior.
- Botón de la barra: **"Ver mensaje"** (habilitado cuando hay nombre, celular válido y al menos un producto).

### 7.2 Vista previa del mensaje

```
┌──────────────────────────────┐
│ [←]      ◆ LOGO ◆        [⚙] │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                              │
│  Así lo recibirá el cliente  │
│                              │
│  ┌────────────────────────┐  │
│  │ 🎄 ¡Gracias por comprar │  │
│  │ en AdrianaDigital!     │  │
│  │                        │  │
│  │ Nombre: Carlos Pérez   │  │
│  │ Celular: 300 123 4567  │  │
│  │ ...                    │  │
│  └────────────────────────┘  │
│                              │
├──────────────────────────────┤
│  [ Enviar por WhatsApp ]     │
└──────────────────────────────┘
```

- El mensaje se muestra dentro de una **burbuja estilo WhatsApp**: fondo `#E7FFDB`, texto `--color-text`, radio de 16 px, sobre un fondo `#EFEAE2`. Es la única zona fuera de la paleta de marca, y se justifica porque simula el chat real.
- Texto con `white-space: pre-wrap` para respetar los saltos de línea tal cual se enviarán.
- Flecha atrás en el header, a la izquierda; el logo sigue centrado.
- Botón de la barra: **"Enviar por WhatsApp"** con el ícono de WhatsApp.

### 7.3 Ajustes de mensaje

- Se abre desde el ícono ⚙ del header.
- Dos campos de texto multilínea: **Saludo** y **Despedida**, con botón "Restaurar original".
- Vista previa en vivo de cómo queda la burbuja.
- Botón **Guardar** en la barra inferior.

## 8. Componentes

### Botones

| Tipo | Estilo | Uso |
|------|--------|-----|
| Primario | Fondo `--color-navy`, texto blanco, 52 px de alto, radio 12 px, ancho completo | Acción principal de la pantalla |
| Secundario | Fondo blanco, borde `--color-navy` 1.5 px, texto `--color-navy` | "Agregar producto" |
| Peligro / ícono | Ícono `--color-pink-dark` o `--color-error`, 48×48 px de área táctil | Eliminar producto |

- Estados: **hover/press** oscurece un 8 %; **foco** con anillo `--color-blue` de 2 px y separación de 2 px; **deshabilitado** al 40 % de opacidad, sin sombra.
- Un solo botón primario por pantalla.
- El botón "Enviar por WhatsApp" mantiene el estilo primario (azul marino) con el ícono de WhatsApp a la izquierda; no se introduce verde de marca.

### Campos de texto
- Alto de **52 px**, borde 1 px `--color-border`, radio 12 px, fondo blanco.
- Etiqueta visible **arriba** del campo (no solo placeholder).
- Foco: borde `--color-blue` y anillo suave.
- Error: borde `--color-error`, ícono y mensaje de 13 px debajo.
- Celular: teclado numérico (`inputmode="tel"`). Precio y cantidad: `inputmode="numeric"`.
- El precio se muestra con formato de miles (`$20.000`) al salir del campo.

### Tarjetas
- Fondo blanco, borde 1 px, radio 16 px, relleno 16 px, sombra suave.

### Íconos
- Librería: **Lucide**, trazo de 1.75 px, tamaño 24 px (20 px dentro de campos).
- Color por defecto `--color-text-muted`; activos en `--color-navy`.

## 9. Estados y mensajes

| Situación | Cómo se muestra |
|-----------|-----------------|
| Sin productos aún | Texto de ayuda en gris dentro de la tarjeta: "Agrega el primer producto" |
| Campo inválido | Borde y texto de error en rojo con ícono, mensaje corto y claro |
| Celular inválido | "Revisa el número: debe tener 10 dígitos" |
| Guardado de ajustes | Aviso breve (toast) abajo, 2 s, con ícono de check |
| Sin conexión | Pastilla discreta bajo el header: "Sin conexión — puedes seguir generando mensajes" |

- Textos de interfaz en español, tuteo informal pero respetuoso, frases cortas.

## 10. Movimiento

- Transiciones de **150–200 ms**, curva `ease-out`. Solo en foco, presionado y apertura de pantallas.
- Nada de animaciones largas ni decorativas.
- Respetar `prefers-reduced-motion`: sin transiciones cuando el usuario lo pide.

## 11. Accesibilidad

- Áreas táctiles mínimas de **48×48 px**, con 8 px de separación.
- Contraste según la sección 3.
- Todos los campos con `label` asociado; los errores con `aria-describedby`.
- Foco visible siempre; orden de tabulación lógico.
- Los íconos que son botones llevan `aria-label` (por ejemplo "Ajustes", "Eliminar producto").
- Soportar texto del sistema ampliado hasta 130 % sin romper el diseño.

## 12. Particularidades PWA

- `theme_color`: `#1C2377`. `background_color`: `#FFFFFF`.
- `display`: `standalone`, orientación `portrait`.
- Ícono de la app: la **"A" del logo sola**, sobre fondo blanco, en 192 px y 512 px, con versión *maskable* (dejando margen de seguridad del 20 %).
- Nombre corto: `AdrianaDigital`.
- Pantalla de arranque con fondo blanco y logo centrado.

## 13. Temporada navideña

- El **mensaje** lleva los emojis navideños (ver `AGENTS.md`). La **interfaz no se re-colorea ni se decora**: la paleta de marca se mantiene todo el año.
- Permitido, y solo si se pide: un detalle pequeño y sutil en la vista previa. Nada de nieve, luces parpadeantes ni fondos temáticos.

## 14. Fuera del alcance visual (por ahora)

- Modo oscuro.
- Temas personalizables.
- Ilustraciones, animaciones complejas o fotos de producto.

## 15. Tokens listos para usar

```css
:root {
  /* Marca */
  --color-navy: #1C2377;
  --color-blue: #1E88E5;
  --color-cyan: #29B6F6;
  --color-pink: #F06292;
  --color-pink-dark: #C2185B;

  /* Neutros */
  --color-bg: #F6F8FC;
  --color-surface: #FFFFFF;
  --color-border: #E3E8F2;
  --color-text: #1A1F36;
  --color-text-muted: #5B6478;

  /* Estados */
  --color-success: #2E9E6B;
  --color-error: #C62828;
  --color-warning: #B26A00;

  /* Degradado */
  --gradient-brand: linear-gradient(90deg, #29B6F6 0%, #1E88E5 50%, #F06292 100%);

  /* Espaciado */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;

  /* Forma */
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-card: 0 2px 8px rgba(28, 35, 119, 0.08);

  /* Tipografía */
  --font-heading: 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Layout */
  --header-height: 64px;
  --content-max-width: 480px;
  --tap-target: 48px;
}
```

Todos los estilos deben leer estos tokens. **No se escriben colores ni medidas sueltas en los componentes.**

## 16. Reglas para el agente

1. Usar solo los tokens de la sección 15; si falta uno, proponerlo antes de inventarlo.
2. No alterar el logo (color, proporción, efectos).
3. Mantener el logo centrado en el header en todas las pantallas.
4. No agregar librerías de componentes pesadas; basta con CSS propio (o Tailwind/CSS Modules si se confirma).
5. Verificar el diseño en **360 px de ancho** antes de dar una pantalla por terminada.
6. No añadir elementos decorativos que no estén descritos aquí.
7. Los commits de cambios visuales siguen las reglas de git de `AGENTS.md` (por ejemplo `feature: add centered logo header`).

## 17. Criterios de aceptación visual

- [ ] El logo está centrado en el header, sin deformarse, en todas las pantallas.
- [ ] La línea degradada se ve bajo el header.
- [ ] Todo cabe y se lee bien a 360 px de ancho, sin scroll horizontal.
- [ ] Ningún botón o campo tiene menos de 48 px de área táctil.
- [ ] El texto cumple contraste 4.5:1.
- [ ] La vista previa se ve como una burbuja de WhatsApp y respeta los saltos de línea.
- [ ] Los colores salen únicamente de los tokens.
- [ ] La app se instala como PWA con el ícono de la "A" y la barra de estado en azul marino.

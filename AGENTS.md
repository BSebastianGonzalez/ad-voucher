# AGENTS.md — Comprobantes por WhatsApp (AdrianaDigital)

> **Documentos relacionados**
> - [`DESIGN.md`](./DESIGN.md): diseño visual de la app (logo, colores, tipografía, layout, componentes y tokens). **Leerlo siempre antes de crear o modificar cualquier parte de la interfaz.** Si algo visual no está en este archivo, se resuelve con docs/`DESIGN.md`.

## 1. Contexto

App pensada para usarse **desde el teléfono**. Sirve para armar y enviar por WhatsApp un mensaje tipo **comprobante de venta** al cliente, con un texto personalizado según el caso.

- Negocio: **AdrianaDigital**.
- Es un **comprobante informal**, no una factura electrónica DIAN. En el texto no se debe usar la palabra "factura".
- Usuario único: quien atiende el negocio (no hay login ni multiusuario).
- Idioma de la app y del mensaje: español (Colombia).

## 2. Objetivo

Reducir a segundos el envío del comprobante: llenar nombre, celular y productos, ver el mensaje generado y abrirlo en WhatsApp listo para enviar.

## 3. Alcance

### Dentro del alcance (MVP)
- Formulario: nombre, celular, lista de productos (nombre, cantidad, precio).
- Cálculo automático del total.
- Generación del mensaje a partir de una plantilla.
- Vista previa del mensaje antes de enviar.
- Botón "Enviar por WhatsApp" que abre el chat con el mensaje prellenado.
- Saludo y despedida **editables** (por ejemplo, cambiar el cierre de Navidad por otro).

### Fuera del alcance (por ahora)
- Backend, base de datos remota, colas (RabbitMQ) o cualquier servicio en la nube.
- Consulta de clientes o historial de ventas.
- Envío 100% automático (WhatsApp Cloud API).
- Factura electrónica DIAN.
- Autenticación, roles, pagos, inventario.

### Posible evolución (no implementar sin pedirlo)
- Guardado local de clientes y ventas con búsqueda.
- Catálogo de productos para autocompletar.
- Exportar/importar respaldo en JSON.
- Campos opcionales: cédula y dirección.

## 4. Mensaje

### Plantilla base

```
🎄 ¡Gracias por comprar en AdrianaDigital!

Nombre: {nombre}
Celular: {celular}

🎁 Productos:
{cantidad} x {producto} — {precio}
{cantidad} x {producto} — {precio}

Total: {total}

¡Esperamos que regrese y le deseamos feliz navidad ^^! 🎅
```

### Ejemplo renderizado

```
🎄 ¡Gracias por comprar en AdrianaDigital!

Nombre: Carlos Pérez
Celular: 300 123 4567

🎁 Productos:
2 x Producto A — $20.000
1 x Producto B — $5.000

Total: $25.000

¡Esperamos que regrese y le deseamos feliz navidad ^^! 🎅
```

### Emojis
- Navideños pero con medida: **uno por bloque** (saludo, productos, despedida), nunca varios seguidos.
- Los datos del cliente (nombre, celular) y el total van **sin emojis**, para que se lean claros.
- Los emojis forman parte de la plantilla editable, así que se pueden cambiar o quitar cuando termine la temporada.

### Reglas del mensaje
- Los precios se formatean en pesos colombianos con separador de miles: `$25.000`.
- Los campos opcionales (cédula, dirección) **solo aparecen si tienen valor** y si el usuario los activó.
- Saludo y despedida son texto configurable, no van quemados en el código.
- La plantilla vive en un único módulo para poder cambiarla sin tocar la UI.

## 5. Requisitos funcionales

| ID | Requisito |
|----|-----------|
| RF-01 | Ingresar nombre y celular del cliente. |
| RF-02 | Agregar, editar y quitar productos de la venta (nombre, cantidad, precio). |
| RF-03 | Calcular el total automáticamente. |
| RF-04 | Generar el mensaje con la plantilla vigente. |
| RF-05 | Mostrar vista previa del mensaje. |
| RF-06 | Abrir WhatsApp con el mensaje prellenado vía `https://wa.me/<numero>?text=<mensaje>`. |
| RF-07 | Editar saludo y despedida, y conservarlos en el dispositivo. |
| RF-08 | Validar campos obligatorios antes de enviar. |

## 6. Requisitos no funcionales

- **Costo cero:** sin servidores de pago. Si se publica, solo en hosting gratuito y estático.
- **Móvil primero:** diseño pensado para pantalla de teléfono y uso con una mano.
- **Privacidad:** los datos del cliente no salen del dispositivo; no hay analítica ni llamadas a terceros.
- **Simplicidad:** pocas pantallas, pocas dependencias.
- **Funciona offline** para generar el mensaje (solo el envío necesita WhatsApp).

## 7. Reglas técnicas

- Teléfono del cliente: es el **destino** del enlace `wa.me`. Quitar espacios, guiones y símbolos; anteponer `57` si no trae indicativo. Validar que queden 12 dígitos para Colombia.
- Número del negocio: **no se configura en la app**. El mensaje sale desde la cuenta de WhatsApp que esté instalada en el teléfono del usuario, así que no hay número propio que guardar ni exponer.
- Sin `.env` ni claves: el MVP no usa API ni secretos. Si más adelante se migra a WhatsApp Cloud API, las credenciales **no pueden ir en un PWA** (quedarían visibles en el navegador) y exigirían un backend; no implementar sin pedirlo.
- Mensaje: pasar por `encodeURIComponent` antes de armar el enlace, para conservar saltos de línea, tildes y emojis.
- Dinero: manejar valores como **enteros en pesos**, nunca decimales flotantes.
- La lógica de negocio (plantilla, total, normalización de teléfono) va separada de la UI y con **pruebas unitarias**.
- Persistencia local (solo configuración en el MVP): `localStorage` o equivalente de la plataforma elegida.

## 8. Stack

**Confirmado: PWA** (instalable desde el navegador, sin tiendas de apps).

- Base sugerida: React + Vite + TypeScript.
- Despliegue gratuito en hosting estático (GitHub Pages, Netlify o Vercel).
- Debe incluir `manifest` y service worker para poder instalarse y funcionar offline.
- El agente **no debe cambiar el stack** sin confirmación.

## 9. Estructura sugerida

```
src/
  domain/        # tipos, total, normalización de teléfono, plantilla (sin UI)
  ui/            # pantallas y componentes
  storage/       # configuración local
tests/           # pruebas de domain/
```

## 10. Criterios de aceptación del MVP

- [ ] Con nombre, celular y al menos un producto se genera el mensaje esperado.
- [ ] El total coincide con la suma de cantidad × precio.
- [ ] Al tocar "Enviar por WhatsApp" se abre el chat correcto con el mensaje intacto (saltos de línea y emojis).
- [ ] Se puede cambiar el saludo y la despedida, y persisten al recargar.
- [ ] Un celular inválido o un campo obligatorio vacío bloquea el envío con un mensaje claro.
- [ ] Usable en un teléfono de gama media.
- [ ] Cero costo de infraestructura.

## 11. Git

### Commits
- Formato: `tipo: mensaje`.
- **Mensaje siempre en inglés**, corto y en lenguaje normal, como lo diría una persona.
- Tipos permitidos: `feature`, `fix`, `chore`, `docs`, `test`, `refactor`.
- Una sola idea por commit.
- Modo imperativo, minúscula después de los dos puntos y sin punto final.
- Idealmente de 60 caracteres o menos en total. Sin scope entre paréntesis.

| Sí | No |
|----|----|
| `feature: add phone number validation` | `feat(domain): implemented comprehensive phone normalization module` |
| `fix: total when quantity is zero` | `fixed bug` |
| `feature: show message preview before sending` | `changes` |
| `chore: setup vite and pwa manifest` | `chore: updated files and also refactored a few things` |
| `docs: add run instructions to readme` | `docs: Update README.md.` |

### Ramas
- `main`: siempre estable y desplegable. **Nunca se hace commit directo.**
- Cada cambio va en su propia rama, creada desde `main` actualizado.
- Nombres en inglés, minúsculas y con guiones, con prefijo según el tipo:
  - `feature/<nombre>`: funcionalidad nueva (`feature/message-template`).
  - `fix/<nombre>`: corrección de errores (`fix/phone-normalization`).
  - `chore/<nombre>`: configuración, dependencias, limpieza (`chore/setup-vite`).
  - `docs/<nombre>`: documentación (`docs/readme`).
- Ramas pequeñas y de corta vida: una rama por requisito (RF-xx) o por tarea concreta.

### Flujo
1. Actualizar `main` y crear la rama de la tarea.
2. Hacer commits pequeños mientras se avanza.
3. Antes de integrar, correr pruebas y build; deben pasar.
4. Integrar a `main` con merge (o PR si se usa GitHub) y borrar la rama.

### Reglas para el agente
- No hacer `push --force`, no reescribir historial de `main` y no borrar ramas que no creó.
- No incluir secretos, `.env` ni archivos generados (`node_modules`, `dist`) en commits; mantener `.gitignore` al día.
- Si una tarea mezcla varias cosas, separarla en varios commits o ramas.

## 12. Cómo debe trabajar el agente

1. Implementar por fases: primero el MVP completo, luego lo que se pida.
2. No agregar funciones fuera del alcance (sección 3).
3. Ante una ambigüedad que cambie el diseño, preguntar antes de asumir.
4. Mantener el código simple, tipado y con pruebas en la lógica de dominio.
5. No introducir servicios externos, claves de API ni dependencias pesadas.
6. Documentar en el README cómo correr, probar y desplegar.
7. Seguir las reglas de git de la sección 11 en todo cambio.
8. Para todo lo visual (colores, tipografía, espaciado, header con el logo centrado, componentes), seguir `DESIGN.md`. No inventar estilos ni colores fuera de sus tokens.
9. Si `AGENTS.md` y `DESIGN.md` se contradicen: `AGENTS.md` manda en funcionalidad y alcance; `DESIGN.md` manda en apariencia.

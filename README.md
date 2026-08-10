# OHO 2.0 — Ecommerce Frontend

Frontend de un ecommerce visual inspirado en la identidad underground de
**OHO 2.0**, enfocado en productos y diseños relacionados con fotografía,
video, música y cultura urbana.

Esta primera fase funciona completamente con datos mock y almacenamiento
local. No necesita un backend ni variables de entorno.

## Estado del proyecto

Frontend MVP terminado y preparado para validación de producción y
despliegue en Netlify.

Incluye:

- Catálogo de productos.
- Galería de diseños.
- Filtros por categoría.
- Detalle individual de productos y diseños.
- Personalización de productos.
- Favoritos.
- Carrito de compra.
- Registro e inicio de sesión mock.
- Rutas protegidas.
- Checkout con borrador persistente.
- Creación e historial de pedidos.
- Detalle individual de pedidos.
- Estados de carga y error.
- Página 404 personalizada.
- Diseño responsive.
- Mejoras de accesibilidad.

## Stack

- Node.js 22.19.0
- npm 10.9.3
- Next.js 16.3.0
- React 19.2.8
- React DOM 19.2.8
- TypeScript 5
- App Router
- CSS Modules
- ESLint 9
- Tailwind CSS 4 instalado como dependencia
- Datos mock
- `localStorage` y `sessionStorage`

## Requisitos

Antes de iniciar, verifica que tengas instalados:

```bash
node --version
npm --version
```

Versiones utilizadas durante el desarrollo:

```text
Node.js: 22.19.0
npm: 10.9.3
```

## Instalación

Clona el repositorio y entra al frontend:

```bash
git clone <URL_DEL_REPOSITORIO>
cd oho-2.0/front
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Ejecuta el build de producción |
| `npm run lint` | Ejecuta ESLint |

Validación recomendada:

```bash
npm run lint && npm run build
```

Para probar localmente el build de producción:

```bash
npm run build
npm run start
```

## Variables de entorno

Esta fase no utiliza variables de entorno.

No es necesario crear archivos `.env` o `.env.local` para ejecutar el
proyecto.

## Credenciales demo

Puedes iniciar sesión con:

```text
Correo: demo@oho20.mx
Contraseña: OhoDemo20
```

También puedes registrar un usuario nuevo desde `/register`.

Las cuentas creadas en esta fase se almacenan localmente en el navegador y
no se envían a ningún servidor.

## Rutas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Landing y presentación de OHO 2.0 | Público |
| `/products` | Catálogo de productos | Público |
| `/products/[slug]` | Detalle y personalización de producto | Público |
| `/designs` | Galería y filtros de diseños | Público |
| `/designs/[slug]` | Detalle individual de diseño | Público |
| `/favorites` | Diseños marcados como favoritos | Público |
| `/cart` | Carrito de compra | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro mock | Público |
| `/checkout` | Datos de compra y confirmación | Protegido |
| `/account` | Perfil e historial de pedidos | Protegido |
| `/account/orders/[orderNumber]` | Detalle de un pedido | Protegido |

Una ruta inexistente muestra la página 404 personalizada.

## Funcionalidades

### Catálogo de productos

- Consulta de productos mock.
- Filtros por categoría.
- Tarjetas con imagen, nombre, categoría y precio.
- Navegación al detalle mediante `slug`.
- Estados vacíos cuando no existen coincidencias.

### Galería de diseños

- Consulta de diseños mock.
- Filtros por categorías:
  - Concert
  - Street
  - Studio
  - Backstage
  - Portrait
- Diseños destacados.
- Selección mediante parámetros de URL.
- Navegación al detalle de cada diseño.

### Personalización

En el detalle de producto se puede seleccionar:

- Diseño.
- Formato:
  - Standard
  - Large
  - Premium
- Cantidad de 1 a 10.

El precio final se calcula de acuerdo con la configuración seleccionada.

Para agregar un artículo al carrito es obligatorio seleccionar un diseño
válido.

### Favoritos

- Agregar diseños a favoritos.
- Eliminar diseños de favoritos.
- Persistencia después de recargar la página.
- Estado vacío cuando no existen favoritos.

### Carrito

- Agregar productos personalizados.
- Incrementar o disminuir cantidades.
- Eliminar artículos.
- Vaciar el carrito.
- Cálculo de subtotal y total.
- Persistencia en `localStorage`.
- Sincronización mediante eventos de almacenamiento.

### Autenticación mock

- Inicio de sesión con usuario demo.
- Registro de usuarios locales.
- Validación de correo.
- Contraseña mínima de ocho caracteres.
- Confirmación de contraseña.
- Prevención de correos duplicados.
- Sesión persistente.
- Cierre de sesión.
- Redirección a la ruta solicitada originalmente.
- Protección de `/checkout` y `/account`.

### Checkout

- Formulario de información del comprador.
- Datos de envío.
- Validaciones antes de confirmar.
- Resumen del pedido.
- Borrador persistente por usuario.
- Limpieza manual del borrador.
- Creación de un pedido mock.
- Limpieza del carrito después de confirmar.
- Redirección al detalle del pedido creado.

### Cuenta y pedidos

- Información del usuario autenticado.
- Historial de pedidos.
- Estado, fecha, productos y total.
- Detalle individual mediante número de pedido.
- Persistencia de pedidos creados.
- Datos semilla para la cuenta demo.

## Persistencia local

La aplicación utiliza almacenamiento del navegador para simular la
persistencia de un backend.

### `localStorage`

Se utiliza para conservar:

- Usuarios registrados.
- Sesión activa.
- Favoritos.
- Carrito.
- Pedidos.
- Borrador del checkout.

El carrito también utiliza la clave:

```text
oho-cart
```

### `sessionStorage`

Se utiliza durante el flujo de checkout para información temporal asociada
a la navegación y confirmación del pedido.

Para reiniciar completamente la demo puedes borrar los datos del sitio
desde las herramientas del navegador:

```text
DevTools → Application → Storage → Clear site data
```

La información es local a cada navegador y dispositivo.

## Arquitectura

El proyecto separa presentación, estado, reglas de aplicación y acceso a
datos.

```text
app/components
      ↓
features
      ↓
services
      ↓
repositories
      ↓
mocks / localStorage
```

### Directorios principales

```text
app/
├── account/
├── cart/
├── checkout/
├── designs/
├── favorites/
├── login/
├── products/
├── register/
├── error.tsx
├── layout.tsx
├── loading.tsx
├── not-found.tsx
├── page.tsx
└── providers.tsx

components/
├── designs/
├── layout/
└── ui/

features/
├── auth/
├── cart/
└── favorites/

lib/
├── cart/
├── storage/
└── utils/

mocks/
repositories/
services/
types/
```

### Responsabilidad por capa

| Directorio | Responsabilidad |
| --- | --- |
| `app` | Rutas, layouts, páginas y composición |
| `components` | Componentes reutilizables de UI y layout |
| `features` | Estado y comportamiento por funcionalidad |
| `services` | Casos de uso, validaciones y reglas |
| `repositories` | Acceso abstracto a mocks y almacenamiento |
| `mocks` | Datos iniciales de productos, diseños, usuarios y pedidos |
| `types` | Contratos TypeScript del dominio |
| `lib` | Utilidades e infraestructura compartida |

Los módulos usan `"use client"` únicamente cuando necesitan eventos,
hooks, contextos, estado del navegador o almacenamiento web.

## Dominio

Los contratos principales se encuentran en `types/`:

- `auth.ts`
- `cart.ts`
- `common.ts`
- `design.ts`
- `order.ts`
- `product.ts`

Los repositorios disponibles son:

- `auth.repository.ts`
- `cart.repository.ts`
- `catalog.repository.ts`
- `favorites.repository.ts`
- `order.repository.ts`

Los servicios disponibles son:

- `auth.service.ts`
- `cart.service.ts`
- `catalog.service.ts`
- `favorites.service.ts`
- `order.service.ts`
- `pricing.service.ts`

## Estados especiales

Next.js utiliza los siguientes archivos globales:

| Archivo | Función |
| --- | --- |
| `app/loading.tsx` | Estado global de carga |
| `app/error.tsx` | Captura de errores y opción de reintento |
| `app/not-found.tsx` | Página personalizada para rutas inexistentes |

## Accesibilidad

La interfaz incluye:

- HTML semántico.
- Etiquetas asociadas a campos.
- Nombres accesibles en controles con símbolos.
- Estados mediante `aria-pressed`.
- Mensajes mediante `aria-live`.
- Indicadores mediante `aria-busy`.
- Navegación con teclado.
- Activación mediante `Enter`.
- Foco visible.
- Compatibilidad con `prefers-reduced-motion`.
- Adaptación al zoom del navegador.

## Diseño responsive

Las rutas principales fueron revisadas en:

```text
Móvil: 390 × 844
Escritorio: 1440 × 900
```

También se validaron:

- Ausencia de scroll horizontal.
- Tarjetas e imágenes sin desbordamiento.
- Navegación utilizable en móvil.
- Formularios y botones visibles.
- Página 404 responsive.
- Contenido funcional con zoom al 200 %.

## Pruebas manuales sugeridas

### Compra como usuario demo

1. Abre `/login`.
2. Inicia sesión con las credenciales demo.
3. Entra a `/products`.
4. Selecciona un producto.
5. Elige un diseño, formato y cantidad.
6. Agrega el producto al carrito.
7. Entra a `/cart`.
8. Continúa al checkout.
9. Completa los datos solicitados.
10. Confirma el pedido.
11. Verifica la redirección al detalle.
12. Abre `/account` y comprueba el historial.
13. Recarga la página y confirma la persistencia.

### Protección de rutas

1. Cierra sesión.
2. Abre directamente `/checkout` o `/account`.
3. Comprueba la redirección al login.
4. Inicia sesión.
5. Verifica el regreso a la ruta solicitada.

### Favoritos

1. Abre `/designs`.
2. Marca uno o más diseños.
3. Entra a `/favorites`.
4. Recarga la página.
5. Comprueba que los favoritos permanezcan.

### Estados globales

1. Abre una ruta inexistente y valida la página 404.
2. Comprueba que sus enlaces funcionen.
3. Navega con `Tab` y verifica el foco visible.
4. Ejecuta el proyecto con el build de producción.

## Despliegue en Netlify

El despliegue está previsto para Netlify.

Configuración esperada:

```text
Base directory: front
Build command: npm run build
Publish directory: .next
```

Si el repositorio conectado contiene directamente este frontend, la
carpeta base puede dejarse vacía.

La configuración definitiva se agregará al proyecto antes del despliegue.

## Limitaciones de esta fase

Esta versión es una demostración frontend:

- No existe una API real.
- No existe base de datos.
- La autenticación no es segura para producción.
- Las contraseñas se guardan localmente sin cifrado.
- Los pagos son simulados.
- Los pedidos solo existen en el navegador actual.
- No existe sincronización entre dispositivos.
- Las imágenes y datos proceden de recursos mock.
- Limpiar el almacenamiento elimina la información creada localmente.

No deben utilizarse credenciales personales reales en esta versión.

## Próxima fase

La siguiente fase incorporará un backend con:

- API REST.
- Node.js y Express.
- MongoDB.
- Autenticación segura.
- Hash de contraseñas.
- Persistencia real.
- Administración de productos y diseños.
- Pedidos asociados a usuarios.
- Integración de pagos en una fase posterior.

## Documentación adicional

La separación de capas también está resumida en:

```text
ARCHITECTURE.md
```

## Autor

**Víctor Hugo Segundo Aguilar**

Frontend desarrollado como proyecto de hackatón para OHO 2.0.

# OHO 2.0 — Ecommerce Frontend

Frontend de un ecommerce visual inspirado en la identidad underground de
**OHO 2.0**, enfocado en productos y diseños relacionados con fotografía,
música y cultura urbana.

Esta etapa funciona con datos mock y almacenamiento del navegador. Permite
probar el flujo completo de compra tanto con una cuenta como en modalidad
de invitado, pero todavía no procesa pagos, correos ni productos reales.

## Estado del proyecto

La etapa frontend mock está terminada y desplegada en Netlify:

https://oho-2.netlify.app/

Incluye:

- Catálogo de productos.
- Galería y filtros de diseños.
- Detalle y personalización de productos.
- Favoritos persistentes.
- Carrito persistente.
- Registro e inicio de sesión mock.
- Compra con una cuenta.
- Compra como invitado.
- Checkout con borrador persistente.
- Confirmación individual del pedido invitado.
- Historial y detalle de pedidos para usuarios registrados.
- Estados globales de carga, error y página 404.
- Diseño responsive y navegación accesible.

## Stack

- Node.js 22.19.0
- npm 10.9.3
- Next.js 16.3.0
- React 19.2.8
- React DOM 19.2.8
- TypeScript 5
- Next.js App Router
- CSS Modules
- ESLint 9
- Tailwind CSS 4 instalado como dependencia
- Datos mock
- `localStorage` y `sessionStorage`

## Requisitos

Versiones utilizadas durante el desarrollo:

```text
Node.js: 22.19.0
npm: 10.9.3
```

Puedes comprobar tus versiones con:

```bash
node --version
npm --version
```

## Instalación

Clona el repositorio:

```bash
git clone git@github.com:viictorhugodevmx/oho-2-front.git
cd oho-2-front
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
| `npm run dev` | Inicia Next.js en desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Ejecuta el build de producción |
| `npm run lint` | Ejecuta ESLint |

Validación recomendada:

```bash
npm run lint && npm run build
```

Para ejecutar localmente el build de producción:

```bash
npm run build
npm run start
```

## Variables de entorno

La etapa frontend mock no utiliza variables de entorno.

No es necesario crear `.env` o `.env.local`. La futura conexión con el
backend incorporará su propia configuración de entorno.

## Credenciales demo

```text
Correo: demo@oho20.mx
Contraseña: OhoDemo20
```

También se puede registrar un usuario desde `/register`.

Las cuentas y contraseñas de esta etapa se almacenan únicamente en el
navegador. No deben utilizarse datos personales reales.

## Rutas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Landing de OHO 2.0 | Público |
| `/products` | Catálogo de productos | Público |
| `/products/[slug]` | Detalle y personalización | Público |
| `/designs` | Galería y filtros de diseños | Público |
| `/designs/[slug]` | Detalle de un diseño | Público |
| `/favorites` | Diseños favoritos | Público |
| `/cart` | Carrito de compra | Público |
| `/login` | Inicio de sesión y acceso como invitado | Público |
| `/register` | Registro mock | Público |
| `/checkout` | Datos y confirmación de compra | Cuenta o invitado |
| `/order-confirmation/[orderNumber]` | Confirmación de compra invitada | Invitado de la sesión |
| `/account` | Perfil e historial de pedidos | Cuenta autenticada |
| `/account/orders/[orderNumber]` | Detalle de un pedido | Cuenta autenticada |

Una ruta inexistente muestra la página 404 personalizada.

## Funcionalidades

### Productos y diseños

- Consulta de productos y diseños mock.
- Filtros por categoría.
- Navegación mediante `slug`.
- Detalle individual.
- Selección de diseño.
- Selección de formato `Standard`, `Large` o `Premium`.
- Cantidad de 1 a 10.
- Cálculo del precio según la configuración.

Para agregar un producto al carrito se debe seleccionar un diseño válido.

### Favoritos

- Agregar y eliminar diseños.
- Persistencia después de recargar.
- Estado vacío cuando no existen favoritos.

### Carrito

El proyecto utiliza un único carrito activo ubicado en:

```text
lib/cart/cart-store.ts
```

Su clave de almacenamiento es:

```text
oho-cart
```

Permite:

- Agregar productos personalizados.
- Incrementar o disminuir cantidades.
- Eliminar artículos.
- Vaciar el carrito.
- Calcular subtotal y total.
- Conservar el contenido al recargar.
- Sincronizar cambios mediante eventos del navegador.

### Autenticación mock

- Inicio de sesión con el usuario demo.
- Registro de usuarios locales.
- Validación de correo.
- Contraseña mínima de ocho caracteres.
- Confirmación de contraseña.
- Prevención de correos duplicados.
- Sesión persistente.
- Cierre de sesión.
- Protección de cuenta e historial.
- Regreso a la ruta solicitada después de iniciar sesión.

### Checkout con cuenta

Un usuario autenticado puede:

- Completar los datos de entrega.
- Revisar el resumen de compra.
- Guardar temporalmente el borrador.
- Confirmar un pedido mock.
- Consultar el pedido desde su cuenta.
- Ver su historial acumulado.

### Checkout como invitado

Desde el acceso al checkout, una persona puede elegir **Continuar como
invitado** sin crear una cuenta.

El flujo invitado permite:

- Completar datos de contacto y entrega.
- Confirmar un pedido mock.
- Recibir un folio.
- Consultar la confirmación individual durante la sesión actual.
- Revisar productos, importes y datos de entrega.

El invitado no tiene perfil ni historial acumulado. En la futura etapa con
backend, la consulta posterior se realizará mediante un enlace seguro
enviado al correo indicado durante la compra.

Crear una cuenta después de comprar no asociará automáticamente los
pedidos invitados.

### Cuenta y pedidos

Los usuarios registrados disponen de:

- Información de cuenta.
- Historial acumulado.
- Estado, fecha, productos y total.
- Detalle mediante número de pedido.
- Persistencia local de pedidos.
- Datos semilla para el usuario demo.

## Persistencia local

### `localStorage`

Se utiliza para conservar:

- Usuarios registrados.
- Sesión activa.
- Favoritos.
- Carrito.
- Pedidos.
- Borradores del checkout.

### `sessionStorage`

Se utiliza para mantener temporalmente el acceso a la confirmación de una
compra invitada dentro del navegador actual.

Para reiniciar la demostración:

```text
DevTools → Application → Storage → Clear site data
```

La información es local a cada navegador y dispositivo.

## Arquitectura

```text
app / components
       ↓
features
       ↓
services
       ↓
repositories
       ↓
mocks / almacenamiento del navegador
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
├── order-confirmation/
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
└── favorites/

lib/
├── cart/
├── checkout/
├── storage/
└── utils/

docs/
mocks/
repositories/
services/
types/
```

### Responsabilidad por capa

| Directorio | Responsabilidad |
| --- | --- |
| `app` | Rutas, layouts, páginas y composición |
| `components` | Interfaz y componentes reutilizables |
| `features` | Estado y comportamiento por funcionalidad |
| `services` | Casos de uso, validaciones y reglas |
| `repositories` | Acceso a mocks y almacenamiento |
| `mocks` | Datos iniciales |
| `types` | Contratos TypeScript |
| `lib` | Infraestructura y utilidades compartidas |
| `docs` | Estado y contratos para la transición al backend |

Los módulos usan `"use client"` únicamente cuando necesitan eventos,
hooks, contextos o almacenamiento del navegador.

## Dominio

Contratos principales:

- `types/auth.ts`
- `types/cart.ts`
- `types/common.ts`
- `types/design.ts`
- `types/order.ts`
- `types/product.ts`

Repositorios activos:

- `repositories/auth.repository.ts`
- `repositories/catalog.repository.ts`
- `repositories/favorites.repository.ts`
- `repositories/order.repository.ts`

Servicios activos:

- `services/auth.service.ts`
- `services/catalog.service.ts`
- `services/favorites.service.ts`
- `services/order.service.ts`

El carrito utiliza su almacén activo en `lib/cart/cart-store.ts`; no existe
un segundo repositorio o contexto de carrito.

## Estados especiales

| Archivo | Función |
| --- | --- |
| `app/loading.tsx` | Estado global de carga |
| `app/error.tsx` | Captura de errores y reintento |
| `app/not-found.tsx` | Página personalizada para rutas inexistentes |

## Accesibilidad

La interfaz incluye:

- HTML semántico.
- Etiquetas asociadas con sus campos.
- Nombres accesibles en controles con símbolos.
- Estados mediante atributos ARIA.
- Mensajes mediante `aria-live`.
- Navegación con teclado.
- Foco visible.
- Compatibilidad con `prefers-reduced-motion`.
- Adaptación al zoom del navegador.

## Diseño responsive

Las rutas principales fueron revisadas en móvil y escritorio, incluyendo:

- Ausencia de scroll horizontal.
- Tarjetas e imágenes sin desbordamiento.
- Navegación utilizable.
- Formularios y botones visibles.
- Página 404 responsive.
- Contenido funcional con zoom al 200 %.

## Pruebas manuales sugeridas

### Compra con una cuenta

1. Abre `/login`.
2. Inicia sesión con las credenciales demo.
3. Selecciona un producto y un diseño.
4. Agrega el producto al carrito.
5. Continúa al checkout.
6. Completa los datos de entrega.
7. Confirma el pedido.
8. Comprueba el detalle y el historial en `/account`.
9. Recarga y confirma la persistencia.

### Compra como invitado

1. Cierra cualquier sesión existente.
2. Agrega uno o más productos al carrito.
3. Continúa al checkout.
4. En el login selecciona **Continuar como invitado**.
5. Completa los datos de contacto y entrega.
6. Confirma el pedido.
7. Comprueba el folio, importes y dirección.
8. Verifica que el invitado no tenga perfil ni historial acumulado.

### Protección de cuenta

1. Cierra sesión.
2. Abre `/account`.
3. Comprueba la redirección al login.
4. Inicia sesión.
5. Verifica el regreso a la ruta solicitada.

### Estados globales

1. Abre una ruta inexistente.
2. Valida la página 404.
3. Navega con `Tab`.
4. Comprueba el foco visible.
5. Ejecuta el build de producción.

## Despliegue en Netlify

El frontend mock está desplegado en:

https://oho-2.netlify.app/

El repositorio incluye `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22.19.0"
  NPM_VERSION = "10.9.3"
```

Netlify detecta Next.js y aplica su integración para App Router, páginas
estáticas, rutas dinámicas y renderizado bajo demanda.

El repositorio conectado contiene directamente el frontend, por lo que no
requiere una carpeta base adicional.

No se deben agregar:

- Una redirección SPA hacia `index.html`.
- Un export estático que elimine las rutas dinámicas.
- El plugin antiguo `@netlify/plugin-nextjs`.

## Limitaciones de esta etapa

Esta versión sigue siendo una demostración frontend:

- No existe una API real.
- No existe una base de datos.
- La autenticación no es segura para producción.
- Las contraseñas se guardan localmente sin cifrado.
- Los pagos son simulados.
- No se envían correos.
- No se generan órdenes reales de impresión.
- Los pedidos existen únicamente en el navegador actual.
- No hay sincronización entre dispositivos.
- El acceso invitado depende de la sesión del navegador.
- Limpiar el almacenamiento elimina la información local.

## Próxima etapa

La siguiente etapa será el blueprint y desarrollo local del backend con:

- Node.js.
- Express.
- TypeScript.
- MongoDB 6.0.20.
- API REST.
- Autenticación segura.
- Hash de contraseñas.
- Persistencia real.
- Compra con cuenta e invitado.
- Cotización calculada por el servidor.
- Gestión de pedidos.
- Mailpit para probar correos localmente.
- Preparación para pagos e impresión posteriores.

Los costos y el despliegue del backend en producción se analizarán después
de validar su funcionamiento local.

## Documentación adicional

- `ARCHITECTURE.md`
- `docs/estado-compra-invitado.md`
- `docs/contrato-checkout-v0.1.md`

## Autor

**Víctor Hugo Segundo Aguilar**

Frontend desarrollado como proyecto de hackatón para OHO 2.0.

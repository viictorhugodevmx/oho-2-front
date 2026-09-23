# OHO 2.0 — Contrato inicial de checkout v0.1

Estado: propuesta para cerrar el paso 25.4.3.
Alcance: funcionamiento local con backend, base de datos,
pagos de prueba e impresión simulada.

Este documento actualiza el contrato inicial: comprar ya no requiere
crear una cuenta. Describe el comportamiento objetivo del backend,
no funcionalidades ya implementadas en el frontend mock.

## 1. Tipos de comprador

### Cliente con cuenta

- El backend obtiene su identidad desde una sesión autenticada.
- Puede consultar su historial y el detalle de sus propios pedidos.
- El cliente no envía un userId para determinar el propietario.

### Invitado

- Puede cotizar, comprar y pagar sin registrarse.
- El backend establece una sesión de compra mediante una cookie HttpOnly.
- El pedido se guarda con userId null.
- El correo de contacto es obligatorio.
- No dispone de perfil ni historial acumulado.
- Comprar no crea una cuenta automáticamente.

Los identificadores locales del mock no se aceptarán como credenciales
de acceso en el backend.

## 2. Carrito

- El visitante conserva su selección en el navegador.
- Al cotizar, envía producto, variante, diseño y cantidad.
- El backend valida disponibilidad, compatibilidad y cantidades.
- El cliente autenticado tendrá carrito persistido en la base de datos.
- Al iniciar sesión se combinarán los carritos sin duplicar una misma
  operación de combinación por reintentos.
- La cantidad máxima inicial es 10 por combinación de producto,
  variante y diseño.
- El backend informa los ajustes o artículos no disponibles.
- Comprar como invitado no requiere combinar el carrito con una cuenta.

## 3. Datos de la compra

Cada artículo solicitado contiene:

- productId.
- variantId.
- designId.
- quantity.

El checkout incluye:

- contactEmail.
- shippingAddress.fullName.
- shippingAddress.phone.
- shippingAddress.street.
- shippingAddress.neighborhood.
- shippingAddress.city.
- shippingAddress.state.
- shippingAddress.postalCode.
- shippingAddress.countryCode: MX para el alcance inicial.
- deliveryNotes: opcional.

El backend valida estos datos para ambos tipos de comprador.

## 4. Importes y cotización

- Moneda inicial: MXN.
- Importes de la API: enteros en centavos.
- El backend calcula precios, subtotal, envío y total.
- Los precios enviados por el navegador no son una fuente de autoridad.
- La cotización devuelve quoteId, expiresAt, artículos e importes.
- La cotización queda asociada al comprador o su sesión invitada.
- Al crear el pedido se comprueban vigencia, disponibilidad e importes.
- Un cambio requiere una nueva cotización y revisión del comprador.

Regla provisional de desarrollo:

- Envío: 14900 centavos.
- Envío gratuito desde 150000 centavos de subtotal.
- No representa una tarifa real del proveedor de impresión.
- No se calcula por código postal en esta etapa.

## 5. Creación del pedido

La solicitud utiliza una cotización vigente y una clave
Idempotency-Key.

El backend:

1. Identifica al comprador por su sesión.
2. Valida la cotización y los datos de contacto y entrega.
3. Guarda el pedido pendiente de pago.
4. Conserva una copia de los nombres, variantes, diseños, cantidades
   y precios utilizados, independiente de cambios futuros al catálogo.
5. Devuelve el folio, importes y estados.

Una misma clave con la misma solicitud devuelve el mismo resultado.
La misma clave con datos distintos produce un conflicto.
La prevención de duplicados debe persistir en la base de datos.

## 6. Estados separados

Pedido:

- pending_payment.
- confirmed.
- cancelled.
- completed.

Pago:

- pending.
- succeeded.
- failed.
- cancelled.

Impresión y entrega:

- not_requested.
- queued.
- submitted.
- in_production.
- shipped.
- delivered.
- failed.

Estos estados sustituyen el avance automático del mock.
La tabla completa de transiciones se definirá en el blueprint.

## 7. Pago e impresión

- El pago se realizará en un entorno de pruebas.
- Regresar a la pantalla de éxito no confirma el pago.
- El backend valida el evento del proveedor y evita procesarlo dos veces.
- Solo un pago confirmado permite solicitar impresión.
- La impresión se simula mediante un adaptador local.
- Reintentar una operación no debe generar otra solicitud de impresión.
- Un pago fallido conserva la posibilidad de reintentar según el estado
  del pedido.
- Al confirmar el pago se descuentan del carrito los artículos comprados,
  conservando las incorporaciones posteriores.

## 8. Acceso al pedido invitado

### Después de comprar

La sesión invitada permite consultar su pedido y continuar el pago.
El servidor comprueba que el pedido pertenece a esa sesión.

### Consulta posterior

- Se envía al correo de contacto un enlace con un token aleatorio,
  limitado al pedido y con caducidad.
- En desarrollo local el correo se inspecciona mediante Mailpit.
- El token se almacena de forma no recuperable en la base de datos.
- Al canjearlo se establece un acceso limitado mediante cookie HttpOnly.
- El token no se conserva en la URL después del canje.
- Solo el folio o conocer el correo no concede acceso.
- La solicitud de un nuevo enlace devuelve una respuesta genérica
  y tiene límites de frecuencia.

La duración exacta del acceso se fijará en el blueprint.

## 9. Registro después de comprar

- Crear una cuenta no vincula automáticamente pedidos invitados.
- Compartir el mismo correo no demuestra propiedad de esos pedidos.
- La vinculación requiere un flujo explícito con verificación del correo
  y autorización.
- Ese flujo de vinculación queda fuera del alcance local inicial.

## 10. Endpoints de compra

Prefijo: /api/v1.

- POST /checkout/guest-session
  Establece la sesión invitada. No crea un usuario.

- POST /checkout/quote
  Cotiza para un cliente autenticado o una sesión invitada.

- POST /orders
  Crea un pedido propio usando quoteId e Idempotency-Key.

- GET /orders
  Devuelve el historial del cliente autenticado.
  No ofrece un historial para invitados.

- GET /orders/:orderNumber
  Devuelve el pedido si la sesión autenticada, invitada o el acceso
  limitado concedido están autorizados para ese pedido.

- POST /orders/:orderNumber/payment-session
  Inicia o recupera el pago autorizado de un pedido pendiente.

- POST /guest-order-access/request
  Solicita enviar un enlace de acceso al correo del pedido.
  Responde de forma genérica, exista o no una coincidencia.

- POST /guest-order-access/exchange
  Canjea el token válido por acceso limitado al pedido.

- POST /webhooks/payments/:provider
  Recibe eventos cuya autenticidad verifica el backend.

Autenticación, catálogo, carrito de cuenta y favoritos mantienen
la distribución acordada en el contrato inicial.

## 11. Respuestas y errores

- Las respuestas con contenido usan data.
- Las listas paginadas añaden meta.
- Los errores incluyen error.code y error.message.
- Los errores de campos pueden incluir error.fields.
- Se distinguen validación, sesión requerida, permisos, recurso
  no disponible, cotización vencida y conflictos.
- Nunca se devuelven contraseñas, hashes ni secretos de acceso.

## 12. Diferencias respecto al mock validado

El frontend mock actual:

- Usa localStorage para pedidos.
- Usa sessionStorage para la identidad invitada.
- Permite consultar la confirmación en esa sesión del navegador.
- No envía correos ni procesa pagos.
- Simula el envío al impresor.
- Conserva los importes actuales expresados en pesos.

La integración con la API migrará los importes a centavos, la
persistencia al backend y las comprobaciones de acceso al servidor.

## 13. Pendientes para el blueprint

- Esquemas de base de datos e índices únicos.
- Duración de sesiones, cotizaciones y accesos invitados.
- Configuración de cookies, protección CSRF y CORS.
- Transiciones de estado y tratamiento de reintentos.
- Configuración del proveedor de pago de pruebas.
- Adaptador de impresión simulada y sus escenarios de fallo.
- Pruebas de precios manipulados, acceso ajeno y eventos duplicados.
- Endpoints y permisos de administración.

# OHO 2.0 — Estado de compra como invitado

## Cierres confirmados por Víctor

- App OHO 2.0 - paso 25.4.1 listo.
- App OHO 2.0 - paso 25.4.2 listo.
- App OHO 2.0 - paso 25.4.3.1 listo.
- App OHO 2.0 - paso 25.4.3.2 listo.
- App OHO 2.0 - paso 25.4.3 listo.
- App OHO 2.0 - paso 25.4.4.1 listo.

## Resultado implementado

La compra como invitado está implementada y aceptada dentro del frontend
mock.

El flujo permite:

- Continuar al checkout sin crear una cuenta.
- Capturar datos de contacto y entrega.
- Generar un pedido mock con folio.
- Mostrar una confirmación con productos, importes y dirección.
- Consultar esa confirmación individual durante la sesión actual.

Los estilos propios de la confirmación y las acciones del login fueron
revisados y aceptados.

## Diferencia entre cuenta e invitado

### Cliente con cuenta

- Tiene perfil.
- Conserva historial acumulado.
- Consulta sus pedidos desde `/account`.
- Abre el detalle en `/account/orders/[orderNumber]`.

### Invitado

- No tiene perfil.
- No posee historial acumulado.
- Consulta únicamente la confirmación individual.
- El acceso depende de la sesión actual del navegador.

Crear una cuenta posteriormente no asocia automáticamente pedidos
realizados como invitado.

## Alcance actual

La etapa todavía utiliza almacenamiento del navegador.

No existen:

- Backend.
- Base de datos.
- Pagos reales.
- Correos reales.
- Órdenes reales de impresión.
- Consulta entre dispositivos.

La pantalla de confirmación indica expresamente que se trata de una compra
de demostración.

## Contrato preparado

El comportamiento esperado para la futura API está documentado en:

```text
docs/contrato-checkout-v0.1.md
```

El contrato contempla:

- Compra con cuenta.
- Compra como invitado.
- Precios calculados por el servidor.
- Cotización previa.
- Idempotencia.
- Estados separados de pedido, pago e impresión.
- Acceso seguro al pedido invitado.
- Enlace enviado por correo.
- Pruebas locales de correo mediante Mailpit.

## Continuación

El paso 25.4.3 está cerrado.

El trabajo actual corresponde al cierre documental y técnico de la etapa
frontend mock en el paso 25.4.4.

Después se elaborará el blueprint del backend para funcionamiento local con
Node.js, Express, TypeScript y MongoDB 6.0.20.

Los costos y el despliegue del backend en producción permanecen fuera del
alcance inmediato.

# OHO 2.0 — Compra como invitado

## Estado

- Último paso principal cerrado por Víctor: 25.4.2.
- Paso principal abierto: 25.4.3 — contrato frontend/backend.
- Ajuste en curso: 25.4.3.1 — compra como invitado.
- Validación local del conjunto: pendiente.
- Cierre explícito de Víctor: pendiente.

## Comportamiento

- Login ofrece continuar como invitado al regresar a /checkout.
- /checkout?guest=1 permite comprar sin crear una cuenta.
- /account mantiene su protección.
- Los pedidos invitados tienen userId null.
- Correo de contacto y referencias quedan en el pedido.
- El borrador se separa por cuenta o identidad invitada.
- La confirmación invitada está fuera de /account.
- Se conservan los pedidos anteriores.
- Registrarse después no vincula automáticamente compras invitadas.

## Límites de esta etapa

- Persistencia en el navegador.
- Pago e impresión simulados.
- No se envían correos.
- La identidad invitada de sessionStorage no es seguridad de backend.
- La prevención de duplicados cubre la misma ejecución del navegador;
  la garantía entre pestañas y procesos corresponde al backend.
- Se conserva la regla visible de envío: 149 MXN, gratis desde 1500 MXN.

## Validación pendiente

- Lint y build.
- Compra invitada.
- Restauración del borrador al recargar.
- Doble clic sin duplicar el pedido.
- Recarga de confirmación.
- Confirmación no disponible en otra sesión independiente.
- Compra con cuenta e historial.
- Protección de /account.
- Revisión móvil del acceso y la confirmación.

## Continuación

Actualizar el contrato con compra invitada en 25.4.3.2.
El paso 25.4.3 permanece abierto hasta el cierre de Víctor.

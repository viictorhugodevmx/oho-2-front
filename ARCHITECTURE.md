# OHO 2.0 Front Architecture

- app: rutas, layouts y composición de páginas.
- components: UI y layout reutilizables.
- features: módulos funcionales con componentes y estado.
- services: casos de uso y reglas de aplicación.
- repositories: acceso abstracto a datos mock y localStorage.
- mocks: datos semilla.
- types: contratos del dominio.
- lib: utilidades e infraestructura compartida.

Flujo actual:

app/components -> features -> services -> repositories -> mocks/localStorage

Regla de cliente:

"use client" solo se utiliza cuando un módulo necesita eventos, hooks,
contextos, estado del navegador o localStorage.

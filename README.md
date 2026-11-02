# Espencer

App para registrar y controlar gastos financieros personales, con inicio de sesión de Google y datos guardados en Firestore.

## Stack

- React + Vite
- Tailwind CSS v4
- Firebase Authentication (Google) y Cloud Firestore con caché local persistente

## Pantallas

- Dashboard: ingresos, gastos fijos, objetivos y libre del mes, dona de reparto, gastos por categoría, por pagar, e historial de los últimos meses con promedios y gráficas.
- Presupuesto: gastos del mes editables, estado de pago y totales recalculados.
- Objetivos: metas de ahorro, inversión y deudas por mes. Los abonos de las deudas con fecha en el mes aparecen solos como objetivos de categoría Deudas, con el estado sincronizado.
- Deudas: varias deudas, cada una con su tabla de amortización, gráfico de saldo y ritmo de pago.

Un selector de mes permite navegar entre meses; un mes vacío puede copiarse del anterior.

## Configuración de Firebase

1. Crea un proyecto en Firebase, activa Authentication con Google y crea una base Firestore.
2. Copia `.env.example` como `.env` y completa los valores de tu app web.
3. Publica las reglas de `firestore.rules` en Firestore > Reglas: cada usuario solo accede a `users/{uid}`.

Estructura de datos:

```
users/{uid}/months/{AAAA-MM}                 ingresos
users/{uid}/months/{AAAA-MM}/expenses/{id}   concepto, presupuesto, pagado, categoría
users/{uid}/months/{AAAA-MM}/goals/{id}      concepto, monto, categoría, cumplido
users/{uid}/debts/{id}                       nombre, total
users/{uid}/debts/{id}/payments/{id}         fecha, monto, pagado
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

# Espencer

App para registrar y controlar gastos financieros personales. Por ahora es un maquetado del front con datos de ejemplo (agosto).

## Stack

- React + Vite
- Tailwind CSS v4
- Datos mock en `src/data/mock.js` (los cambios se pierden al recargar)

## Pantallas

- Dashboard: ingresos, gastos fijos, objetivos, libre, dona de reparto, gastos por categoría y pendientes.
- Presupuesto: gastos del mes editables, estado de pago y totales recalculados.
- Objetivos: metas de ahorro, inversión y deudas editables, con estado cumplido/pendiente y totales por categoría.
- Deudas: tabla de amortización editable con restante calculado, gráfico de saldo y ritmo de pago.
- Dashboard: además del mes, historial de los últimos meses con promedios y gráficas (datos de ejemplo).

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

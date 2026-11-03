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
- Gastos diarios (compartidos): un hogar con invitación por enlace donde los miembros registran compras en tiempo real, dividen cada gasto, marcan quién ya pagó su parte y registran abonos. Muestra el balance acumulado entre los miembros.

Un selector de mes permite navegar entre meses; un mes vacío puede copiarse del anterior.

## Configuración de Firebase

1. Crea un proyecto en Firebase, activa Authentication con Google y crea una base Firestore.
2. Copia `.env.example` como `.env` y completa los valores de tu app web.
3. Publica las reglas con `npm run deploy:rules`: cada usuario solo accede a `users/{uid}` y a los hogares de los que es miembro.

Estructura de datos:

```
users/{uid}/months/{AAAA-MM}                 ingresos
users/{uid}/months/{AAAA-MM}/expenses/{id}   concepto, presupuesto, pagado, categoría
users/{uid}/months/{AAAA-MM}/goals/{id}      concepto, monto, categoría, cumplido
users/{uid}/debts/{id}                       nombre, total
users/{uid}/debts/{id}/payments/{id}         fecha, monto, pagado

households/{hid}                             nombre, creador
households/{hid}/members/{uid}               apodo, foto, rol
households/{hid}/invites/{token}             vence, creado por
households/{hid}/expenses/{id}               fecha, concepto, valor, pagó, método, reparto, saldado
households/{hid}/settlements/{id}            fecha, de, para, monto, nota
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run deploy        # compila y publica en Firebase Hosting
npm run deploy:rules  # publica firestore.rules
```

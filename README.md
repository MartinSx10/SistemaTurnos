# Fútbol 5 Turnos

Sistema web de gestión de turnos para una cancha de fútbol 5, desarrollado con Angular.

## Descripción

Este proyecto permite reservar turnos, visualizar horarios disponibles y administrar reservas desde un panel de administración simple y funcional.

Fue pensado como una primera versión MVP orientada a portfolio, con foco en una experiencia clara, responsive y fácil de usar.

## Funcionalidades principales

- Reserva de turnos por fecha y horario
- Bloqueo de horarios ya ocupados
- Validación de formulario
- Panel administrador con login simple
- Cambio de estado de reservas: reservado, pagado o cancelado
- Filtro de reservas por fecha
- Resumen de métricas en el panel admin
- Persistencia local con localStorage
- Diseño responsive para escritorio y móvil

## Tecnologías utilizadas

- Angular
- TypeScript
- SCSS
- LocalStorage

## Acceso administrador

Esta primera versión incluye un acceso administrador básico pensado para demostración y pruebas.

- Contraseña de prueba: `admin123`

## Objetivo del proyecto

Simular un sistema real de reservas para un negocio deportivo, aplicando lógica de turnos, validaciones, administración de estados y diseño responsive.

## Próximas mejoras

### Versión 2
- Backend con Node.js y Express
- Base de datos
- Autenticación real para administrador
- Persistencia de reservas en servidor
- Mejoras de seguridad
- Gestión de múltiples canchas

## Instalación y ejecución

```bash
npm install
ng serve

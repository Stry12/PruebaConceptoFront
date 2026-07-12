# Discovery — Hospital Management System

## Propósito
Sistema web para digitalizar la gestión hospitalaria, reemplazando procesos manuales en papel que causan:
- Pérdida de información clínica
- Dificultad para acceder al historial de pacientes
- Errores humanos en registros
- Recetas médicas difíciles de leer

## Problema central
El flujo de atención ambulatoria (OPD) depende de papel: el recepcionista registra en una cola física, el doctor escribe prescripciones a mano, y no existe un historial centralizado. El sistema debe centralizar estos procesos en una interfaz clara, rápida y profesional.

## Público objetivo / Roles
| Rol | Tarea principal | Contexto de uso |
|---|---|---|
| **Recepcionista** | Registra pacientes en la cola OPD, busca pacientes existentes | Estación fija en recepción, uso intensivo de búsqueda y formularios |
| **Doctor** | Atiende pacientes de la cola, genera prescripciones, consulta historial | Consultorio, necesita ver información clínica rápido y generar prescripciones legibles |
| **Administrador** | Gestiona empleados (CRUD completo) y asigna roles | Oficina admin, uso administrativo/estructural |

## Plataforma
- **Web desktop** — Panel administrativo en navegador (estaciones fijas: recepción, consultorio, oficina admin).
- Responsive no es prioridad (las estaciones son de escritorio), pero el layout debe ser usable en monitores de 1280px–1920px.

## Restricciones
- **Accesibilidad:** WCAG AA como mínimo (contraste, navegación por teclado, labels en formularios).
- **Idioma:** Español (Interfaz completa en español).
- **Modo oscuro:** Solo light mode por ahora.
- **Branding:** Sin marca existente. Diseño desde cero.
- **Tono visual:** Profesional, limpio, inspirado en sistemas de salud modernos — no lúdico ni corporativo frío. Equilibrio entre seriedad médica y usabilidad.

## Procesos de negocio clave
1. **Login** — Autenticación por rol (Admin, Doctor, Receptionist).
2. **Gestión de pacientes** — Registro, búsqueda rápida, historial de visitas OPD.
3. **Flujo OPD** — Recepcionista registra en cola → Doctor atiende → Doctor genera prescripción.
4. **Prescripciones** — Generación digital con medicamento y notas, asociadas a paciente y doctor.
5. **Administración de empleados** — CRUD de empleados con roles.

## Entidades (fuente: domain.md)
Employee (abstract: Admin, Doctor, Receptionist), Patient, OPD, Prescription.

## Criterios de éxito
- Las prescripciones generadas son fácilmente legibles (problema #1 del estado actual).
- La búsqueda de pacientes es rápida (< 2 segundos para encontrar un paciente existente).
- El flujo OPD (registrar → atender → prescribir) se completa sin fricción.
- La interfaz transmite profesionalismo y limpieza (no parece un formulario genérico).

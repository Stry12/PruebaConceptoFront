# UX Flow — Hospital Management System

## Arquitectura de información

### Layout global (todas las pantallas autenticadas)
```
┌──────────────────────────────────────────────────┐
│  Header (64px) — Logo + nombre usuario + rol    │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │  Contenido principal                  │
│ (240px)  │  (fluido, restante)                   │
│          │                                       │
│          │                                       │
│          │                                       │
└──────────┴───────────────────────────────────────┘
```

- **Sidebar fija** con navegación de alto nivel. Itens varían según el rol del usuario.
- **Header** con logo del sistema (izquierda), nombre y rol del usuario autenticado (derecha), e ícono de cerrar sesión.
- **Contenido principal** con fondo `--color-bg` (#F8FAFC), padding de 32px.

### Navegación por rol

| Rol | Sidebar items |
|---|---|
| **Recepcionista** | Cola OPD · Buscar Paciente · Registrar Paciente |
| **Doctor** | Cola OPD · Buscar Paciente |
| **Administrador** | Empleados · Registrar Empleado |

- Los items de sidebar se filtran por rol — cada usuario solo ve lo que le corresponde.
- "Buscar Paciente" es compartido entre Recepcionista y Doctor pero se muestra en la misma posición del sidebar.

---

## User flows

### Flow 1 — Login
```
[Login screen] → (credenciales correctas) → [Dashboard según rol]
                 → (credenciales incorrectas) → (mensaje de error inline, sin alert)
```

### Flow 2 — Recepcionista: Registro de paciente
```
[Sidebar: Registrar Paciente]
→ [Formulario: datos del paciente]
→ (envío exitoso) → [Mensaje de éxito + limpiar formulario]
→ (error) → (mensaje inline en el campo con error)
```

### Flow 3 — Recepcionista: Gestión de cola OPD
```
[Sidebar: Cola OPD]
→ [Vista: lista de pacientes en cola, con estado y hora de llegada]
→ Botón "Agregar a cola" → [Modal: buscar paciente existente → seleccionar → confirmar]
→ (confirmado) → paciente aparece en la lista
→ Botón "Eliminar" en fila → [Modal de confirmación] → (confirmado) → removido de la cola
```

### Flow 4 — Doctor: Atención de paciente
```
[Sidebar: Cola OPD]
→ [Vista: lista de pacientes en cola, con botón "Atender"]
→ Click "Atender" en fila → [Detalle del paciente + historial OPD]
→ Click en visita OPD del historial → [Detalle de la visita + prescripciones]
→ Botón "Crear Prescripción" → [Formulario de prescripción]
→ (envío exitoso) → [Detalle de prescripción generada]
→ Botón "Dar de alta" (discharge) → [Modal de confirmación] → paciente removido de cola
```

### Flow 5 — Doctor: Búsqueda de paciente
```
[Sidebar: Buscar Paciente]
→ [Campo de búsqueda + resultados en tiempo real]
→ Click en resultado → [Detalle del paciente + historial OPD]
→ (misma ruta que Flow 4 desde "Detalle del paciente")
```

### Flow 6 — Administrador: Gestión de empleados
```
[Sidebar: Empleados]
→ [Vista: tabla de empleados con filtros por rol]
→ Botón "Registrar Empleado" → [Formulario: datos del empleado + selección de rol]
→ (envío exitoso) → [Tabla actualizada]
→ Click en fila → [Modal: editar empleado]
→ Botón "Eliminar" en fila → [Modal de confirmación] → (confirmado) → removido
```

---

## Inventario de pantallas

### Pantalla 1: Login
- **Ruta:** `/login`
- **Tipo:** raíz
- **Accesible sin autenticación**
- **Contenido:**
  - Header: Logo del sistema + nombre "HospitalMS"
  - Formulario centrado: email, contraseña, botón "Iniciar Sesión"
  - Mensaje de error inline (no alert global)
- **Jerarquía:** El formulario es el elemento central. Sin sidebar ni header de navegación.

### Pantalla 2: Cola OPD (Recepcionista)
- **Ruta:** `/opd-queue`
- **Tipo:** raíz (nodo base para `[overlay]`)
- **Rol:** Recepcionista
- **Contenido:**
  - Sidebar izquierda con navegación (Cola OPD activo)
  - Título "Cola de Atención" + badge con conteo
  - Botón "Agregar a cola" (primario, teal)
  - Tabla/lista: paciente, hora de llegada, estado (En espera / En atención / Atendido), acciones
  - Empty state cuando la cola está vacía
- **Jerarquía:**
  1. Título + botón "Agregar a cola"
  2. Lista de pacientes en cola
  3. Acciones por fila

### Pantalla 3: Cola OPD (Doctor)
- **Ruta:** `/opd-queue`
- **Tipo:** raíz (diseño diferente al de Recepcionista — el doctor atiende, no administra)
- **Rol:** Doctor
- **Contenido:**
  - Sidebar con navegación (Cola OPD activo)
  - Título "Pacientes en Espera"
  - Lista/cards de pacientes: nombre, hora, estado
  - Botón "Atender" en cada card (solo para pacientes "En espera")
  - Badge de especialidad del doctor (arriba, sutil)
- **Jerarquía:**
  1. Título
  2. Cards de pacientes con botón de acción
  3. Estado vacío / carga

### Pantalla 4: Buscar Paciente
- **Ruta:** `/patients/search`
- **Tipo:** raíz
- **Roles:** Recepcionista, Doctor
- **Contenido:**
  - Sidebar con navegación (Buscar Paciente activo)
  - Campo de búsqueda prominente (ancho completo, con ícono de búsqueda)
  - Resultados en tiempo real (debajo del campo)
  - Cada resultado: avatar con iniciales (paleta rotativa), nombre completo, teléfono, email
  - Click en resultado → navega a Detalle del Paciente
- **Jerarquía:**
  1. Campo de búsqueda
  2. Lista de resultados
  3. Empty state "No se encontraron pacientes"

### Pantalla 5: Registrar Paciente
- **Ruta:** `/patients/register`
- **Tipo:** raíz
- **Rol:** Recepcionista
- **Contenido:**
  - Sidebar con navegación (Registrar Paciente activo)
  - Título "Registrar Nuevo Paciente"
  - Formulario: nombre, apellido, género (select), fecha de nacimiento, teléfono, email, dirección
  - Botón "Registrar" (primario) + "Cancelar" (secundario)
  - Validación inline en cada campo
  - Mensaje de éxito al registrar
- **Jerarquía:**
  1. Título
  2. Formulario (campos en layout de 2 columnas)
  3. Botones de acción

### Pantalla 6: Detalle del Paciente + Historial
- **Ruta:** `/patients/:id`
- **Tipo:** raíz
- **Roles:** Recepcionista, Doctor
- **Contenido:**
  - Sidebar con navegación
  - Breadcrumb: Buscar Paciente > [Nombre del paciente]
  - **Sección superior:** Card con información del paciente (avatar con iniciales, nombre, teléfono, email, dirección, fecha de nacimiento, género)
  - **Sección inferior:** "Historial de Visitas OPD" — tabla con fecha, diagnóstico, estado (alta/no alta), y link a detalle de cada visita
  - Botón "Crear Prescripción" (solo si el usuario es Doctor)
- **Jerarquía:**
  1. Información del paciente (card)
  2. Historial OPD (tabla)
  3. Acciones (crear prescripción)

### Pantalla 7: Detalle de Visita OPD + Prescripciones
- **Ruta:** `/opd/:id`
- **Tipo:** pantalla (derivada de Detalle del Paciente)
- **Contenido:**
  - Breadcrumb: Paciente > [Nombre] > Visita OPD
  - **Card de información de la visita:** ID, fecha, diagnóstico, fecha de admisión, fecha de alta, estado (alta/pendiente)
  - **Sección "Prescripciones":** lista de prescripciones asociadas a esta visita — fecha, medicamento, nota
  - Botón "Crear Prescripción" (solo Doctor)
  - Botón "Dar de Alta" (solo si no está dado de alta, solo Doctor)
- **Jerarquía:**
  1. Info de la visita
  2. Lista de prescripciones
  3. Acciones

### Pantalla 8: Crear Prescripción
- **Ruta:** `/prescriptions/create` (o modal sobre Detalle de Visita OPD)
- **Tipo:** overlay (modal sobre Detalle de Visita OPD)
- **Rol:** Doctor
- **Contenido:**
  - Modal centrado, ancho ~600px
  - Título "Nueva Prescripción"
  - Formulario: medicamento (textarea, línea por medicamento), nota clínica (textarea)
  - Botón "Guardar Prescripción" (primario) + "Cancelar"
  - Validación: medicamento es obligatorio
- **Jerarquía:**
  1. Título del modal
  2. Formulario
  3. Botones de acción

### Pantalla 9: Detalle de Prescripción
- **Ruta:** `/prescriptions/:id`
- **Tipo:** pantalla (accesible desde historial OPD)
- **Contenido:**
  - Breadcrumb: Paciente > [Nombre] > Visita OPD > Prescripción
  - **Card de prescripción:** ID, fecha, nombre del doctor, paciente asociado
  - **Medicamento:** texto formateado, legible (nunca bloque de texto crudo)
  - **Notas clínicas:** texto con formato
  - Diseño optimizado para legibilidad (el problema #1 del sistema actual)
- **Jerarquía:**
  1. Encabezado de la prescripción (meta info)
  2. Medicamento (destacado, fácil de leer)
  3. Notas clínicas

### Pantalla 10: Empleados (Admin)
- **Ruta:** `/employees`
- **Tipo:** raíz (nodo base para `[overlay]`)
- **Rol:** Administrador
- **Contenido:**
  - Sidebar con navegación (Empleados activo)
  - Título "Gestión de Empleados" + badge con conteo
  - Filtros por rol (tabs o chips: Todos, Doctores, Recepcionistas, Admins)
  - Botón "Registrar Empleado" (primario)
  - Tabla: ID, nombre completo, email, teléfono, rol (badge de color), acciones (editar/eliminar)
  - Empty state
- **Jerarquía:**
  1. Título + filtros + botón
  2. Tabla de empleados
  3. Acciones por fila

### Pantalla 11: Formulario Empleado (Crear/Editar)
- **Ruta:** `/employees/create` o `/employees/:id/edit`
- **Tipo:** overlay (modal sobre tabla de empleados)
- **Rol:** Administrador
- **Contenido:**
  - Modal centrado, ancho ~600px
  - Título "Registrar Empleado" o "Editar Empleado"
  - Formulario: nombre, apellido, email, teléfono, género (select), fecha de nacimiento, rol (select: Admin/Doctor/Receptionist), especialidad (campo condicional, solo visible si rol = Doctor)
  - Botón "Guardar" (primario) + "Cancelar"
- **Jerarquía:**
  1. Título del modal
  2. Formulario (2 columnas)
  3. Botones de acción

---

## Árbol de estados por pantalla

### Cola OPD — Recepcionista
```
<Cola OPD (Recepcionista): base>
├─ Estado base: lista de pacientes en cola con datos
├─ [overlay] "Agregar a cola" — disparador: botón "Agregar a cola"
│  └─ Modal: búsqueda de paciente existente + selección + confirmación
├─ [overlay] "Confirmar eliminación" — disparador: ícono eliminar en fila
│  └─ Modal de confirmación: "¿Remover a [nombre] de la cola?"
└─ [caso-borde] vacío: "No hay pacientes en la cola"
```

### Cola OPD — Doctor
```
<Cola OPD (Doctor): base>
├─ Estado base: cards de pacientes en espera con botón "Atender"
├─ [caso-borde] vacío: "No hay pacientes en espera"
└─ [caso-borde] error: "Error al cargar la cola"
```

### Buscar Paciente
```
<Buscar Paciente: base>
├─ Estado base: campo de búsqueda + lista de resultados
├─ [caso-borde] vacío (sin búsqueda): "Ingrese un nombre o ID para buscar"
├─ [caso-borde] vacío (con búsqueda): "No se encontraron pacientes"
└─ [caso-borde] carga: skeleton de resultados
```

### Detalle del Paciente + Historial
```
<Detalle Paciente: base>
├─ Estado base: info del paciente + historial OPD
├─ [caso-borde] sin historial: "Este paciente no tiene visitas registradas"
└─ [caso-borde] error: "Error al cargar información del paciente"
```

### Empleados (Admin)
```
<Empleados (Admin): base>
├─ Estado base: tabla de empleados con datos
├─ [overlay] "Registrar Empleado" — disparador: botón "Registrar Empleado"
│  └─ Modal con formulario
├─ [overlay] "Editar Empleado" — disparador: ícono editar en fila
│  └─ Modal con formulario pre-llenado
├─ [overlay] "Confirmar eliminación" — disparador: ícono eliminar en fila
│  └─ Modal de confirmación
├─ [caso-borde] vacío: "No hay empleados registrados"
└─ [caso-borde] error: "Error al cargar la lista de empleados"
```

### Crear Prescripción (Modal)
```
<Crear Prescripción: overlay sobre Detalle de Visita OPD>
├─ Estado base: formulario vacío
├─ [overlay] "Éxito" — disparador: envío exitoso
│  └─ Mensaje inline: "Prescripción creada exitosamente"
└─ [caso-borde] error de validación: campos requeridos resaltados
```

### Login
```
<Login: pantalla completa>
├─ Estado base: formulario vacío
├─ [caso-borde] credenciales incorrectas: mensaje de error inline bajo el campo
└─ [caso-borde] campos vacíos: validación inline al intentar enviar
```

---

## Pantallas derivadas NO requeridas (decisiones explícitas)

- **No se genera pantalla de "Dashboard/Inicio"** — Cada rol entra directamente a su pantalla principal (Cola OPD para Recepcionista/Doctor, Empleados para Admin). Un dashboard genérico agregaría un paso innecesario en un sistema donde la eficiencia es clave.
- **No se genera pantalla de "Configuración"** — Fuera del scope del dominio actual. Si se necesita en el futuro, se agrega como pantalla nueva.
- **No se genera pantalla de "Notificaciones"** — El sistema actual no tiene flujo de notificaciones. Las acciones inmediatas (éxito/error) se manejan inline.
- **"Cerrar sesión"** es una acción (botón en el header), no una pantalla — se ejecuta y redirige a Login.

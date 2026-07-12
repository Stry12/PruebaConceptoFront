# Domain Model — Hospital Management System

Fuente: Diagrama de clases PlantUML proporcionado por el usuario.

## Entities

### Employee (abstract parent)
| Attribute | Type | Notes |
|---|---|---|
| idEmployee | int | PK |
| name | String | |
| surname | String | |
| email | String | |
| phoneNumber | int | |
| gender | String | |
| dateOfBirth | Date | |
| role | Role | Enum: Admin, Doctor, Receptionist |

Methods: login(), logout()

### Doctor (extends Employee)
| Attribute | Type | Notes |
|---|---|---|
| specialty | String | |

Methods: addPrescription()

### Admin (extends Employee)
Methods: addEmployee(), updateEmployee(), deleteEmployee()

### Receptionist (extends Employee)
Methods: registerPatient()

### Patient
| Attribute | Type | Notes |
|---|---|---|
| idPatient | int | PK |
| name | String | |
| surname | String | |
| gender | String | |
| dateOfBirth | Date | |
| phoneNumber | int | |
| email | String | |
| address | String | |

Methods: getOPD()

### OPD (Outpatient Department visit)
| Attribute | Type | Notes |
|---|---|---|
| idOPD | int | PK |
| diagnosis | String | |
| date | Date | |
| admissionDate | Date | |
| dischargeDate | Date | |
| discharge | boolean | |

Methods: admitPatient(), discharge()

### Prescription
| Attribute | Type | Notes |
|---|---|---|
| idPrescription | int | PK |
| date | Date | |
| note | String | |
| medication | String | |

Methods: addPrescription()

## Relationships

- Employee (1) ── manages ──> (1..*) OPD
- Patient (1) ── has ──> (1..*) OPD
- OPD (1) ── prescribe ──> (0..*) Prescription

## Decisions de implementación (ambigüedades resueltas)

- `phoneNumber` y `idEmployee`/`idPatient`/`idOPD`/`idPrescription` son `int` según el diagrama; se mantienen como tales.
- Los métodos del diagrama (login, logout, addEmployee, etc.) representan operaciones de negocio. En el frontend se traducirán a acciones de UI (botones, formularios, etc.) con datos dummy.
- La herencia Employee→Doctor/Admin/Receptionist se modelará como un discriminated union en los datos dummy (campo `role` como discriminante).

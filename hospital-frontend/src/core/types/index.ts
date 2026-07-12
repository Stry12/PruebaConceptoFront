// Domain types derived from domain.md

export type Role = 'Admin' | 'Doctor' | 'Receptionist';

export interface Employee {
  idEmployee: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  gender: string;
  dateOfBirth: string;
  role: Role;
  specialty?: string;
  active: boolean;
}

export interface Patient {
  idPatient: number;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: number;
  email: string;
  address: string;
}

export interface OPDVisit {
  idOPD: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  date: string;
  admissionDate: string;
  dischargeDate: string | null;
  discharge: boolean;
}

export interface Prescription {
  idPrescription: number;
  opdId: number;
  date: string;
  note: string;
  medication: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  route?: string;
}

export interface OPDQueueItem {
  id: number;
  patientId: number;
  patientName: string;
  patientSurname: string;
  arrivalTime: string;
  status: 'En espera' | 'En atención' | 'Atendido';
  priority?: string;
  visitType?: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  role: Role;
  email: string;
  specialty?: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}

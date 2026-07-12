import type { Patient } from '../types';

export interface IPatientService {
  getAll(): Promise<Patient[]>;
  getById(id: number): Promise<Patient | null>;
  search(query: string): Promise<Patient[]>;
  create(patient: Omit<Patient, 'idPatient'>): Promise<Patient>;
}

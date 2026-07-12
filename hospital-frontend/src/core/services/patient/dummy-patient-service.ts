import type { IPatientService } from '../../interfaces/patient';
import type { Patient } from '../../types';
import { dummyPatients } from '../../data/dummy-patients';

// Mutable state
let patients: Patient[] = [...dummyPatients];

export const dummyPatientService: IPatientService = {
  async getAll(): Promise<Patient[]> {
    return [...patients];
  },

  async getById(id: number): Promise<Patient | null> {
    return patients.find(p => p.idPatient === id) || null;
  },

  async search(query: string): Promise<Patient[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.surname.toLowerCase().includes(q) ||
      p.idPatient.toString().includes(q) ||
      p.phoneNumber.toString().includes(q)
    );
  },

  async create(patient: Omit<Patient, 'idPatient'>): Promise<Patient> {
    const maxId = patients.reduce((max, p) => Math.max(max, p.idPatient), 0);
    const newPatient: Patient = {
      ...patient,
      idPatient: maxId + 1,
    };
    patients = [...patients, newPatient];
    return newPatient;
  },
};

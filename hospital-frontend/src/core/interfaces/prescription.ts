import type { Prescription } from '../types';

export interface IPrescriptionService {
  getByOPDId(opdId: number): Promise<Prescription[]>;
  getById(id: number): Promise<Prescription | null>;
  create(prescription: Omit<Prescription, 'idPrescription'>): Promise<Prescription>;
  delete(id: number): Promise<boolean>;
}

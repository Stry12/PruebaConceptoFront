import type { IPrescriptionService } from '../../interfaces/prescription';
import type { Prescription } from '../../types';
import { dummyPrescriptions } from '../../data/dummy-prescriptions';

// Mutable state
let prescriptions: Prescription[] = [...dummyPrescriptions];

export const dummyPrescriptionService: IPrescriptionService = {
  async getByOPDId(opdId: number): Promise<Prescription[]> {
    return prescriptions.filter(p => p.opdId === opdId);
  },

  async getById(id: number): Promise<Prescription | null> {
    return prescriptions.find(p => p.idPrescription === id) || null;
  },

  async create(prescription: Omit<Prescription, 'idPrescription'>): Promise<Prescription> {
    const maxId = prescriptions.reduce((max, p) => Math.max(max, p.idPrescription), 0);
    const newPrescription: Prescription = {
      ...prescription,
      idPrescription: maxId + 1,
    };
    prescriptions = [...prescriptions, newPrescription];
    return newPrescription;
  },

  async delete(id: number): Promise<boolean> {
    const before = prescriptions.length;
    prescriptions = prescriptions.filter(p => p.idPrescription !== id);
    return prescriptions.length < before;
  },
};

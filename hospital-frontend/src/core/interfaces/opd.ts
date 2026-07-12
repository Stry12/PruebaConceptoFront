import type { OPDVisit, OPDQueueItem } from '../types';

export interface IOPDService {
  getVisitsByPatient(patientId: number): Promise<OPDVisit[]>;
  getVisitById(id: number): Promise<OPDVisit | null>;
  getQueue(): Promise<OPDQueueItem[]>;
  addToQueue(item: Omit<OPDQueueItem, 'id'>): Promise<OPDQueueItem>;
  removeFromQueue(id: number): Promise<boolean>;
  attendPatient(id: number): Promise<OPDQueueItem>;
  discharge(visitId: number): Promise<OPDVisit>;
}

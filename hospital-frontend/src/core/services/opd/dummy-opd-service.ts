import type { IOPDService } from '../../interfaces/opd';
import type { OPDVisit, OPDQueueItem } from '../../types';
import { dummyOPDVisits } from '../../data/dummy-opd-visits';
import { dummyOPDQueue } from '../../data/dummy-opd-queue';

// Mutable state
let visits: OPDVisit[] = [...dummyOPDVisits];
let queue: OPDQueueItem[] = [...dummyOPDQueue];

export const dummyOPDService: IOPDService = {
  async getVisitsByPatient(patientId: number): Promise<OPDVisit[]> {
    return visits.filter(v => v.patientId === patientId);
  },

  async getVisitById(id: number): Promise<OPDVisit | null> {
    return visits.find(v => v.idOPD === id) || null;
  },

  async getQueue(): Promise<OPDQueueItem[]> {
    return [...queue];
  },

  async addToQueue(item: Omit<OPDQueueItem, 'id'>): Promise<OPDQueueItem> {
    const maxId = queue.reduce((max, q) => Math.max(max, q.id), 0);
    const newItem: OPDQueueItem = {
      ...item,
      id: maxId + 1,
    };
    queue = [...queue, newItem];
    return newItem;
  },

  async removeFromQueue(id: number): Promise<boolean> {
    const before = queue.length;
    queue = queue.filter(q => q.id !== id);
    return queue.length < before;
  },

  async attendPatient(id: number): Promise<OPDQueueItem> {
    queue = queue.map(q =>
      q.id === id ? { ...q, status: 'En atención' as const } : q
    );
    const item = queue.find(q => q.id === id);
    if (!item) throw new Error('Queue item not found');
    return item;
  },

  async discharge(visitId: number): Promise<OPDVisit> {
    visits = visits.map(v =>
      v.idOPD === visitId
        ? { ...v, discharge: true, dischargeDate: new Date().toISOString().split('T')[0] }
        : v
    );
    const updated = visits.find(v => v.idOPD === visitId);
    if (!updated) throw new Error('Visit not found');
    return updated;
  },
};

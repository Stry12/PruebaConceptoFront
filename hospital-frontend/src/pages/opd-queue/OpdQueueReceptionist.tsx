import React, { useState, useEffect } from 'react';
import { dummyOPDService } from '@/core/services/opd/dummy-opd-service';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import type { OPDQueueItem, Patient } from '@/core/types';

export function OpdQueueReceptionist() {
  const [queue, setQueue] = useState<OPDQueueItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQueue();
    loadPatients();
  }, []);

  const loadQueue = async () => {
    const data = await dummyOPDService.getQueue();
    setQueue(data);
  };

  const loadPatients = async () => {
    const data = await dummyPatientService.getAll();
    setPatients(data);
  };

  const handleAddToQueue = async () => {
    if (!selectedPatient) return;
    const patient = patients.find(p => p.idPatient === selectedPatient);
    if (!patient) return;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    await dummyOPDService.addToQueue({
      patientId: patient.idPatient,
      patientName: patient.name,
      patientSurname: patient.surname,
      arrivalTime: `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`,
      status: 'En espera',
      visitType: 'Consulta',
    });
    setShowAddModal(false);
    setSelectedPatient(null);
    setSearchQuery('');
    loadQueue();
  };

  const handleRemoveFromQueue = async (id: number) => {
    await dummyOPDService.removeFromQueue(id);
    setShowDeleteConfirm(null);
    loadQueue();
  };

  const statusColors: Record<string, string> = {
    'En espera': 'bg-accent-light text-amber-800',
    'En atención': 'bg-secondary-light text-secondary-hover',
    'Atendido': 'bg-success-light text-success',
  };

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.surname.toLowerCase().includes(q) ||
      p.idPatient.toString().includes(q)
    );
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[28px] font-semibold text-neutral-900 font-headline leading-tight">Cola de Atenci&oacute;n</h2>
          <span className="px-2 py-0.5 bg-primary-light text-primary text-xs font-medium rounded">
            {queue.length} pacientes
          </span>
        </div>
        <Button icon="add" onClick={() => setShowAddModal(true)}>
          Agregar a cola
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-4 text-[12px] font-medium text-neutral-600 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-4 text-[12px] font-medium text-neutral-600 uppercase tracking-wider">Hora de llegada</th>
              <th className="px-6 py-4 text-[12px] font-medium text-neutral-600 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-[12px] font-medium text-neutral-600 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.patientName} surname={item.patientSurname} id={item.patientId} size="sm" />
                    <span className="font-medium text-neutral-900">{item.patientName} {item.patientSurname}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">{item.arrivalTime}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-neutral-400">
                    <button
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="p-1 hover:text-red-600"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <div>Mostrando {queue.length} de {queue.length} pacientes hoy</div>
        </div>
      </div>

      {/* Add to Queue Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar a Cola">
        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar paciente por nombre o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
            {filteredPatients.map((patient) => (
              <button
                key={patient.idPatient}
                onClick={() => setSelectedPatient(patient.idPatient)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  selectedPatient === patient.idPatient ? 'bg-primary-lighter' : 'hover:bg-neutral-50'
                }`}
              >
                <Avatar name={patient.name} surname={patient.surname} id={patient.idPatient} size="sm" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{patient.name} {patient.surname}</p>
                  <p className="text-xs text-neutral-500">ID: {patient.idPatient}</p>
                </div>
              </button>
            ))}
            {filteredPatients.length === 0 && searchQuery && (
              <p className="text-center text-sm text-neutral-500 py-8">No se encontraron pacientes</p>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
          <Button onClick={handleAddToQueue} disabled={!selectedPatient}>Agregar</Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleRemoveFromQueue(showDeleteConfirm)}
        title="Remover de la cola"
        message="¿Est&aacute; seguro que desea remover este paciente de la cola de atenci&oacute;n?"
        confirmLabel="Remover"
      />
    </div>
  );
}

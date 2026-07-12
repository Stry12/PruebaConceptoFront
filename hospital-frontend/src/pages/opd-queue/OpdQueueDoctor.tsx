import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyOPDService } from '@/core/services/opd/dummy-opd-service';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import type { OPDQueueItem } from '@/core/types';

export function OpdQueueDoctor() {
  const [queue, setQueue] = useState<OPDQueueItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const data = await dummyOPDService.getQueue();
    setQueue(data);
  };

  const handleAttend = async (item: OPDQueueItem) => {
    await dummyOPDService.attendPatient(item.id);
    navigate(`/patients/${item.patientId}`);
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-semibold text-neutral-900 tracking-tight">Pacientes en Espera</h1>
            <span className="px-3 py-1 bg-primary-light text-primary text-sm font-semibold rounded-full">
              {queue.filter(q => q.status === 'En espera').length} pacientes
            </span>
          </div>
          {user?.specialty && (
            <span className="text-sm text-neutral-500 font-medium">{user.specialty}</span>
          )}
        </header>

        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-md p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-sm hover:border-primary-light"
            >
              <Avatar name={item.patientName} surname={item.patientSurname} id={item.patientId} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {item.patientName} {item.patientSurname}
                  </h3>
                  {item.priority && (
                    <span className="px-2 py-0.5 bg-accent-light text-accent text-xs font-medium rounded">
                      {item.priority}
                    </span>
                  )}
                  {item.visitType && !item.priority && (
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded">
                      {item.visitType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                    {item.arrivalTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>id_card</span>
                    ID: {item.patientId}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-neutral-500 font-medium">Estado</p>
                  <p className={`text-sm font-medium ${item.status === 'En espera' ? 'text-neutral-900' : item.status === 'En atención' ? 'text-success' : 'text-neutral-500'}`}>
                    {item.status}
                  </p>
                </div>
                {item.status === 'En espera' && (
                  <Button onClick={() => handleAttend(item)}>
                    Atender
                  </Button>
                )}
                {item.status === 'En atención' && (
                  <Button variant="secondary" onClick={() => navigate(`/patients/${item.patientId}`)}>
                    Ver
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

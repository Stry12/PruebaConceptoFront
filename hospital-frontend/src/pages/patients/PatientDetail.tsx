import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { dummyOPDService } from '@/core/services/opd/dummy-opd-service';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { formatDate, getAge } from '@/shared/utils';
import type { Patient, OPDVisit } from '@/core/types';

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<OPDVisit[]>([]);

  useEffect(() => {
    if (id) loadPatient(parseInt(id));
  }, [id]);

  const loadPatient = async (patientId: number) => {
    const p = await dummyPatientService.getById(patientId);
    setPatient(p);
    if (p) {
      const v = await dummyOPDService.getVisitsByPatient(patientId);
      setVisits(v);
    }
  };

  if (!patient) return <div className="p-8 text-center text-neutral-500">Cargando...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
        <a onClick={() => navigate('/patients/search')} className="hover:text-primary transition-colors cursor-pointer">Buscar Paciente</a>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        <span className="font-medium text-neutral-900">{patient.name} {patient.surname}</span>
      </nav>

      {/* Patient Info Card */}
      <section className="mb-8">
        <div className="bg-white border border-neutral-200 rounded-md p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar name={patient.name} surname={patient.surname} id={patient.idPatient} size="lg" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-[22px] font-semibold text-neutral-900">{patient.name} {patient.surname}</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">ID: #H-{patient.idPatient}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 border-t border-neutral-100 pt-8">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Email</p>
              <p className="text-sm text-neutral-900">{patient.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Tel&eacute;fono</p>
              <p className="text-sm text-neutral-900">+52 {patient.phoneNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Direcci&oacute;n</p>
              <p className="text-sm text-neutral-900 truncate">{patient.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Fecha nacimiento</p>
              <p className="text-sm text-neutral-900">{formatDate(patient.dateOfBirth)} ({getAge(patient.dateOfBirth)} a&ntilde;os)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">G&eacute;nero</p>
              <p className="text-sm text-neutral-900">{patient.gender}</p>
            </div>
          </div>
        </div>
      </section>

      {/* OPD Visits History */}
      <section>
        <div className="bg-white border border-neutral-200 rounded-md overflow-hidden shadow-card">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Historial de Visitas OPD</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Registro completo de consultas externas</p>
            </div>
            {user?.role === 'Doctor' && (
              <Button icon="add" onClick={() => navigate(`/opd/${visits[0]?.idOPD || ''}`)}>
                Crear Prescripci&oacute;n
              </Button>
            )}
          </div>

          {visits.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-50/50">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Diagn&oacute;stico</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visits.map((visit) => (
                  <tr key={visit.idOPD} className="hover:bg-neutral-50/80">
                    <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(visit.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">{visit.diagnosis}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        visit.discharge ? 'bg-success-light text-success' : 'bg-secondary-light text-secondary'
                      }`}>
                        {visit.discharge ? 'Alta' : 'Activa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/opd/${visit.idOPD}`)}
                        className="text-neutral-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState icon="medical_information" message="Este paciente no tiene visitas registradas" />
          )}
        </div>
      </section>
    </div>
  );
}

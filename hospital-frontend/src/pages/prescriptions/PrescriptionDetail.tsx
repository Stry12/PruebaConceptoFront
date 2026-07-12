import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPrescriptionService } from '@/core/services/prescription/dummy-prescription-service';
import { dummyOPDService } from '@/core/services/opd/dummy-opd-service';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { formatDate } from '@/shared/utils';
import { Button } from '@/shared/components/ui/Button';
import type { Prescription, OPDVisit, Patient } from '@/core/types';

export function PrescriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [visit, setVisit] = useState<OPDVisit | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (rxId: number) => {
    const rx = await dummyPrescriptionService.getById(rxId);
    setPrescription(rx);
    if (rx) {
      const v = await dummyOPDService.getVisitById(rx.opdId);
      setVisit(v);
      if (v) {
        const p = await dummyPatientService.getById(v.patientId);
        setPatient(p);
      }
    }
  };

  if (!prescription || !visit || !patient) return <div className="p-8 text-center text-neutral-500">Cargando...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1000px] mx-auto mb-8 flex items-center justify-between">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm">
          <a onClick={() => navigate('/patients/search')} className="text-neutral-500 hover:text-primary transition-colors cursor-pointer">Pacientes</a>
          <span className="material-symbols-outlined text-neutral-300" style={{ fontSize: '18px' }}>chevron_right</span>
          <a onClick={() => navigate(`/patients/${patient.idPatient}`)} className="text-neutral-500 hover:text-primary transition-colors cursor-pointer">
            {patient.name} {patient.surname}
          </a>
          <span className="material-symbols-outlined text-neutral-300" style={{ fontSize: '18px' }}>chevron_right</span>
          <a onClick={() => navigate(`/opd/${visit.idOPD}`)} className="text-neutral-500 hover:text-primary transition-colors cursor-pointer">
            Visita OPD #{visit.idOPD}
          </a>
          <span className="material-symbols-outlined text-neutral-300" style={{ fontSize: '18px' }}>chevron_right</span>
          <span className="text-neutral-900 font-medium">Prescripci&oacute;n #{prescription.idPrescription}</span>
        </nav>
      </div>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Back Button */}
        <div className="lg:col-span-1">
          <button
            onClick={() => navigate(`/opd/${visit.idOPD}`)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

        {/* Prescription Card */}
        <div className="lg:col-span-10 xl:col-span-8">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden max-w-[680px]">
            <div className="px-8 pt-8 pb-6 border-b border-neutral-100 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-bold text-neutral-900 font-headline">Prescripci&oacute;n #{prescription.idPrescription}</h2>
                  <span className="bg-secondary-light text-secondary text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100">Activa</span>
                </div>
                <p className="text-[13px] text-neutral-500">Emitida el {formatDate(prescription.date)}</p>
              </div>
            </div>

            <div className="px-8 py-8">
              {/* Medication */}
              <div className="mb-8">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Medicamento</span>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 leading-none">{prescription.medication}</h3>
                    {prescription.dosage && prescription.frequency && (
                      <p className="text-lg font-semibold text-primary mt-2">{prescription.dosage} &bull; {prescription.frequency}</p>
                    )}
                  </div>
                  {prescription.route && (
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-neutral-100 text-neutral-600 text-[13px] font-medium border border-neutral-200">
                      V&iacute;a {prescription.route}
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-neutral-50">
                <div>
                  <span className="block text-xs text-neutral-500 mb-1 font-medium">Frecuencia</span>
                  <p className="text-[15px] font-medium text-neutral-800">{prescription.frequency || '-'}</p>
                </div>
                <div>
                  <span className="block text-xs text-neutral-500 mb-1 font-medium">Duraci&oacute;n</span>
                  <p className="text-[15px] font-medium text-neutral-800">{prescription.duration || '-'}</p>
                </div>
                <div>
                  <span className="block text-xs text-neutral-500 mb-1 font-medium">Paciente</span>
                  <p className="text-[15px] font-medium text-neutral-800">{patient.name} {patient.surname}</p>
                </div>
              </div>

              {/* Notes */}
              {prescription.note && (
                <div className="mt-8">
                  <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Notas Cl&iacute;nicas</span>
                  <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-100">
                    <p className="text-sm leading-relaxed text-neutral-700 italic">"{prescription.note}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center text-neutral-400 text-xs">
                <span>&Uacute;ltima modificaci&oacute;n reciente</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="secondary" icon="print" onClick={() => window.print()}>Imprimir</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

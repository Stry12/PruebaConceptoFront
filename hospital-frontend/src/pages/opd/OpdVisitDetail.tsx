import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyOPDService } from '@/core/services/opd/dummy-opd-service';
import { dummyPrescriptionService } from '@/core/services/prescription/dummy-prescription-service';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { formatDate, getAge } from '@/shared/utils';
import type { OPDVisit, Prescription, Patient } from '@/core/types';

export function OpdVisitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visit, setVisit] = useState<OPDVisit | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showCreatePrescription, setShowCreatePrescription] = useState(false);
  const [showDischargeConfirm, setShowDischargeConfirm] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    route: 'Oral',
    note: '',
  });

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (visitId: number) => {
    const v = await dummyOPDService.getVisitById(visitId);
    setVisit(v);
    if (v) {
      const p = await dummyPatientService.getById(v.patientId);
      setPatient(p);
      const rx = await dummyPrescriptionService.getByOPDId(visitId);
      setPrescriptions(rx);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visit) return;
    await dummyPrescriptionService.create({
      opdId: visit.idOPD,
      date: new Date().toISOString().split('T')[0],
      medication: prescriptionForm.medication,
      dosage: prescriptionForm.dosage,
      frequency: prescriptionForm.frequency,
      duration: prescriptionForm.duration,
      route: prescriptionForm.route,
      note: prescriptionForm.note,
    });
    setShowCreatePrescription(false);
    setPrescriptionForm({ medication: '', dosage: '', frequency: '', duration: '', route: 'Oral', note: '' });
    loadData(visit.idOPD);
  };

  const handleDischarge = async () => {
    if (!visit) return;
    await dummyOPDService.discharge(visit.idOPD);
    setShowDischargeConfirm(false);
    loadData(visit.idOPD);
  };

  const handleDeletePrescription = async () => {
    if (!prescriptionToDelete || !visit) return;
    await dummyPrescriptionService.delete(prescriptionToDelete.idPrescription);
    setPrescriptionToDelete(null);
    setActiveMenuId(null);
    loadData(visit.idOPD);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  if (!visit || !patient) return <div className="p-8 text-center text-neutral-500">Cargando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-medium">
        <a onClick={() => navigate('/patients/search')} className="hover:text-primary transition-colors cursor-pointer">Pacientes</a>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
        <a onClick={() => navigate(`/patients/${patient.idPatient}`)} className="hover:text-primary transition-colors cursor-pointer">
          {patient.name} {patient.surname}
        </a>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
        <span className="text-neutral-900">Visita OPD #{visit.idOPD}</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-[28px] font-semibold text-neutral-900 leading-tight">Detalle de Visita OPD #{visit.idOPD}</h2>
          <p className="text-neutral-500 mt-1">Gesti&oacute;n y seguimiento cl&iacute;nico del paciente en consulta externa.</p>
        </div>
        {!visit.discharge && user?.role === 'Doctor' && (
          <Button variant="secondary" icon="logout" onClick={() => setShowDischargeConfirm(true)}>
            Dar de Alta
          </Button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Visit Summary */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Resumen de Visita</span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-sm ${
                visit.discharge ? 'bg-success-light text-success' : 'bg-secondary-light text-secondary'
              }`}>
                {visit.discharge ? 'Alta' : 'Activa'}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">ID de Visita</label>
                <p className="text-base font-medium text-neutral-900">#{visit.idOPD}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Diagn&oacute;stico Principal</label>
                <p className="text-base font-semibold text-neutral-900">{visit.diagnosis}</p>
              </div>
              <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Fecha Admisi&oacute;n</label>
                  <p className="text-sm font-medium text-neutral-900">{formatDate(visit.admissionDate)}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Fecha Alta</label>
                  <p className={`text-sm font-medium ${visit.dischargeDate ? 'text-neutral-900' : 'text-neutral-400 italic'}`}>
                    {visit.dischargeDate ? formatDate(visit.dischargeDate) : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="bg-primary-lighter p-6 rounded-lg border border-primary-light">
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={patient.name} surname={patient.surname} id={patient.idPatient} size="md" />
              <div>
                <p className="text-base font-bold text-primary">{patient.name} {patient.surname}</p>
                <p className="text-xs text-primary opacity-80">{getAge(patient.dateOfBirth)} a&ntilde;os &bull; {patient.gender}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Prescriptions */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-neutral-400">prescriptions</span>
                <h3 className="text-lg font-semibold text-neutral-900">Prescripciones</h3>
              </div>
              {user?.role === 'Doctor' && (
                <Button icon="add" onClick={() => setShowCreatePrescription(true)}>
                  Crear Prescripci&oacute;n
                </Button>
              )}
            </div>
            <div className="p-0 flex-1">
              <div className="divide-y divide-neutral-100">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.idPrescription}
                    className="p-6 hover:bg-neutral-50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/prescriptions/${rx.idPrescription}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-neutral-400">{formatDate(rx.date)}</span>
                        <h4 className="text-base font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                          {rx.medication}
                        </h4>
                      </div>
                      <div className="relative" ref={activeMenuId === rx.idPrescription ? menuRef : undefined}>
                        <button
                          className="text-neutral-400 hover:text-neutral-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === rx.idPrescription ? null : rx.idPrescription);
                          }}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        {activeMenuId === rx.idPrescription && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                navigate(`/prescriptions/${rx.idPrescription}`);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                              Ver detalle
                            </button>
                            <div className="border-t border-neutral-100 my-0.5"></div>
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-error hover:bg-error-light transition-colors text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setPrescriptionToDelete(rx);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">{rx.note}</p>
                    <div className="mt-4 flex gap-2">
                      {rx.route && (
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[11px] rounded uppercase font-bold tracking-tighter">
                          {rx.route}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {prescriptions.length === 0 && (
                  <div className="p-8 text-center text-sm text-neutral-500">
                    No hay prescripciones para esta visita
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Prescription Modal */}
      <Modal isOpen={showCreatePrescription} onClose={() => setShowCreatePrescription(false)} title="Crear Prescripci&oacute;n" maxWidth="max-w-[560px]">
        <form onSubmit={handleCreatePrescription}>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                Medicamento <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={prescriptionForm.medication}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="Ej. Amoxicilina"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                  Dosis <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                  Frecuencia <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                  Duraci&oacute;n <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">
                  V&iacute;a de administraci&oacute;n <span className="text-error">*</span>
                </label>
                <select
                  value={prescriptionForm.route}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, route: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white cursor-pointer appearance-none"
                >
                  <option value="Oral">Oral</option>
                  <option value="Intravenosa">Intravenosa</option>
                  <option value="T&oacute;pica">T&oacute;pica</option>
                  <option value="Intramuscular">Intramuscular</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Notas cl&iacute;nicas</label>
              <textarea
                value={prescriptionForm.note}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, note: e.target.value })}
                className="w-full p-3 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                rows={4}
                placeholder="Instrucciones especiales, precauciones o motivos de la prescripci&oacute;n..."
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreatePrescription(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {/* Discharge Confirmation */}
      <ConfirmDialog
        isOpen={showDischargeConfirm}
        onClose={() => setShowDischargeConfirm(false)}
        onConfirm={handleDischarge}
        title="Dar de Alta"
        message="¿Est&aacute; seguro que desea dar de alta al paciente de esta visita? Esta acci&oacute;n no se puede deshacer."
        confirmLabel="Dar de Alta"
      />

      {/* Delete Prescription Confirmation */}
      <ConfirmDialog
        isOpen={prescriptionToDelete !== null}
        onClose={() => setPrescriptionToDelete(null)}
        onConfirm={handleDeletePrescription}
        title="Eliminar Prescripci&oacute;n"
        message={`¿Est&aacute; seguro que desea eliminar la prescripci&oacute;n de "${prescriptionToDelete?.medication || ''}"? Esta acci&oacute;n no se puede deshacer.`}
        confirmLabel="Eliminar"
      />
    </div>
  );
}

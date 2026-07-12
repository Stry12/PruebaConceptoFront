import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { Button } from '@/shared/components/ui/Button';

export function PatientRegister() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dummyPatientService.create({
      name: form.name,
      surname: form.surname,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      phoneNumber: parseInt(form.phoneNumber) || 0,
      email: form.email,
      address: form.address,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: '', surname: '', gender: '', dateOfBirth: '', phoneNumber: '', email: '', address: '' });
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-neutral-900">Registrar Nuevo Paciente</h1>
        <p className="text-neutral-500 text-sm mt-1">Complete todos los campos requeridos para dar de alta un nuevo perfil m&eacute;dico.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-8 shadow-sm">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Personal Info Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-primary rounded-full"></div>
              <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Informaci&oacute;n Personal</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="name">Nombre</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="surname">Apellido</label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={form.surname}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="gender">G&eacute;nero</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none appearance-none bg-white"
                  required
                >
                  <option disabled value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="dateOfBirth">Fecha de nacimiento</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-neutral-300 rounded-full"></div>
              <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Contacto</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="phoneNumber">Tel&eacute;fono</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-neutral-600" htmlFor="address">Direcci&oacute;n</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  className="h-10 border border-neutral-200 rounded-sm px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-neutral-100 flex justify-end items-center gap-4">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit">Registrar Paciente</Button>
          </div>
        </form>

        {success && (
          <div className="mt-4 flex items-center gap-2 text-success text-sm font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
            Paciente registrado exitosamente
          </div>
        )}
      </div>
    </div>
  );
}

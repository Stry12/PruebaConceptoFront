import React, { useState, useEffect } from 'react';
import { dummyEmployeeService } from '@/core/services/employee/dummy-employee-service';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { Avatar } from '@/shared/components/ui/Avatar';
import { roleLabels } from '@/shared/utils';
import type { Employee, Role } from '@/core/types';

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Todos los roles');

  // Form state
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    role: '' as Role | '',
    specialty: '',
    active: true,
    gender: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await dummyEmployeeService.getAll();
    setEmployees(data);
  };

  const handleOpenCreate = () => {
    setEditEmployee(null);
    setForm({ name: '', surname: '', email: '', phoneNumber: '', role: '', specialty: '', active: true, gender: '', dateOfBirth: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setForm({
      name: emp.name,
      surname: emp.surname,
      email: emp.email,
      phoneNumber: emp.phoneNumber.toString(),
      role: emp.role,
      specialty: emp.specialty || '',
      active: emp.active,
      gender: emp.gender,
      dateOfBirth: emp.dateOfBirth,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmployee) {
      await dummyEmployeeService.update(editEmployee.idEmployee, {
        name: form.name,
        surname: form.surname,
        email: form.email,
        phoneNumber: parseInt(form.phoneNumber) || 0,
        role: form.role as Role,
        specialty: form.role === 'Doctor' ? form.specialty : undefined,
        active: form.active,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
      });
    } else {
      await dummyEmployeeService.create({
        name: form.name,
        surname: form.surname,
        email: form.email,
        phoneNumber: parseInt(form.phoneNumber) || 0,
        role: form.role as Role,
        specialty: form.role === 'Doctor' ? form.specialty : undefined,
        active: form.active,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
      });
    }
    setShowForm(false);
    loadEmployees();
  };

  const handleDelete = async (id: number) => {
    await dummyEmployeeService.delete(id);
    setDeleteConfirm(null);
    loadEmployees();
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = searchQuery === '' ||
      `${emp.name} ${emp.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'Todos los roles' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadgeClass: Record<string, string> = {
    Doctor: 'bg-primary-light text-primary',
    Receptionist: 'bg-secondary-light text-secondary',
    Admin: 'bg-accent-light text-accent',
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-[22px] font-semibold text-neutral-900 font-headline">Empleados</h2>
            <Button icon="add" onClick={handleOpenCreate}>Agregar Empleado</Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-2 rounded-xl border border-neutral-200 shadow-sm">
            <div className="md:col-span-8 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border-transparent focus:border-primary/20 focus:ring-0 rounded-lg text-sm text-neutral-900 outline-none"
                placeholder="Buscar por nombre o cargo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:col-span-4 flex gap-2">
              <div className="relative w-full">
                <select
                  className="w-full pl-3 pr-10 py-2.5 bg-white border-transparent focus:border-primary/20 focus:ring-0 rounded-lg text-sm text-neutral-600 appearance-none cursor-pointer outline-none"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option>Todos los roles</option>
                  <option>Doctor</option>
                  <option>Recepcionista</option>
                  <option>Admin</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-200">
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Empleado</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Correo Electr&oacute;nico</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.idEmployee} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} surname={emp.surname} id={emp.idEmployee} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{emp.name} {emp.surname}</p>
                        <p className="text-xs text-neutral-500">ID: HMS-{emp.idEmployee}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeClass[emp.role]}`}>
                      {roleLabels[emp.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{emp.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${emp.active ? 'bg-success' : 'bg-neutral-300'}`}></span>
                      <span className={`text-xs font-medium ${emp.active ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {emp.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary-lighter rounded transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(emp.idEmployee)}
                        className="p-1.5 text-neutral-400 hover:text-error hover:bg-error-light rounded transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-neutral-50/30 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-medium">
              Mostrando {filteredEmployees.length} de {employees.length} empleados
            </p>
          </div>
        </div>
      </div>

      {/* Employee Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editEmployee ? 'Editar Empleado' : 'Agregar Empleado'}>
        <form onSubmit={handleSave}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Nombre <span className="text-error">*</span></label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Apellidos <span className="text-error">*</span></label>
                <input
                  required
                  type="text"
                  value={form.surname}
                  onChange={(e) => setForm({ ...form, surname: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Correo Electr&oacute;nico <span className="text-error">*</span></label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Tel&eacute;fono <span className="text-error">*</span></label>
                <input
                  required
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Rol <span className="text-error">*</span></label>
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                  className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all bg-white"
                >
                  <option value="">Seleccionar rol</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Recepcionista</option>
                  <option value="Admin">Administrador</option>
                </select>
              </div>
              {form.role === 'Doctor' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-700">Especialidad</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                    placeholder="Ej. Cardiolog&iacute;a"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between py-4 mt-4">
              <div>
                <p className="text-sm font-medium text-neutral-700">Estado de la cuenta</p>
                <p className="text-xs text-neutral-500">El empleado podr&aacute; acceder al sistema inmediatamente.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-neutral-700">{form.active ? 'Activo' : 'Inactivo'}</span>
              </label>
            </div>
          </div>
          <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-200 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit">{editEmployee ? 'Guardar Cambios' : 'Guardar Empleado'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Eliminar Empleado"
        message="¿Est&aacute; seguro que desea eliminar este empleado? Esta acci&oacute;n no se puede deshacer."
        confirmLabel="Eliminar"
      />
    </div>
  );
}

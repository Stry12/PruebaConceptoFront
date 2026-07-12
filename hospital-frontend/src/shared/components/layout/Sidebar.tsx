import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const navConfig: Record<string, { to: string; icon: string; label: string }[]> = {
  Receptionist: [
    { to: '/opd-queue', icon: 'queue', label: 'Cola OPD' },
    { to: '/patients/search', icon: 'person_search', label: 'Buscar Paciente' },
    { to: '/patients/register', icon: 'person_add', label: 'Registrar Paciente' },
  ],
  Doctor: [
    { to: '/opd-queue', icon: 'clinical_notes', label: 'Cola OPD' },
    { to: '/patients/search', icon: 'person_search', label: 'Buscar Paciente' },
  ],
  Admin: [
    { to: '/employees', icon: 'badge', label: 'Empleados' },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = user ? navConfig[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-neutral-200 shadow-sm z-50 flex flex-col py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>local_hospital</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-primary leading-none font-headline">HospitalMS</h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium mt-1">Medical Center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-lighter text-primary font-semibold'
                  : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
              }`
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto border-t border-neutral-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors rounded-lg text-sm font-medium w-full"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

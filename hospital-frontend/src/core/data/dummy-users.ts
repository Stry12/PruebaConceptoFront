import type { User } from '../types';

export const dummyUsers: Record<string, { password: string; user: User }> = {
  'admin@hospital.com': {
    password: 'admin123',
    user: {
      id: 107,
      name: 'Javier',
      surname: 'Morales',
      role: 'Admin',
      email: 'admin@hospital.com',
    },
  },
  'doctor@hospital.com': {
    password: 'doctor123',
    user: {
      id: 102,
      name: 'Alejandro',
      surname: 'Ruiz',
      role: 'Doctor',
      email: 'doctor@hospital.com',
      specialty: 'Cardiología',
    },
  },
  'recepcionista@hospital.com': {
    password: 'recepcion123',
    user: {
      id: 104,
      name: 'María',
      surname: 'López',
      role: 'Receptionist',
      email: 'recepcionista@hospital.com',
    },
  },
};

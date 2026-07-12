import type { IEmployeeService } from '../../interfaces/employee';
import type { Employee } from '../../types';
import { dummyEmployees } from '../../data/dummy-employees';

// Mutable state
let employees: Employee[] = [...dummyEmployees];

export const dummyEmployeeService: IEmployeeService = {
  async getAll(): Promise<Employee[]> {
    return [...employees];
  },

  async getById(id: number): Promise<Employee | null> {
    return employees.find(e => e.idEmployee === id) || null;
  },

  async create(employee: Omit<Employee, 'idEmployee'>): Promise<Employee> {
    const maxId = employees.reduce((max, e) => Math.max(max, e.idEmployee), 0);
    const newEmployee: Employee = {
      ...employee,
      idEmployee: maxId + 1,
    };
    employees = [...employees, newEmployee];
    return newEmployee;
  },

  async update(id: number, updates: Partial<Employee>): Promise<Employee> {
    employees = employees.map(e =>
      e.idEmployee === id ? { ...e, ...updates } : e
    );
    const updated = employees.find(e => e.idEmployee === id);
    if (!updated) throw new Error('Employee not found');
    return updated;
  },

  async delete(id: number): Promise<boolean> {
    const before = employees.length;
    employees = employees.filter(e => e.idEmployee !== id);
    return employees.length < before;
  },
};

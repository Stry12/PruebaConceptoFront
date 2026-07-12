import type { Employee } from '../types';

export interface IEmployeeService {
  getAll(): Promise<Employee[]>;
  getById(id: number): Promise<Employee | null>;
  create(employee: Omit<Employee, 'idEmployee'>): Promise<Employee>;
  update(id: number, employee: Partial<Employee>): Promise<Employee>;
  delete(id: number): Promise<boolean>;
}

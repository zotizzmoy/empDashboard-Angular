
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private storageKey = 'employees';

  constructor() {}

  private getEmployeesFromStorage(): Employee[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveEmployeesToStorage(employees: Employee[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
  }

  getEmployees(): Employee[] {
    return this.getEmployeesFromStorage();
  }

  addEmployee(employee: Employee): void {
    const employees = this.getEmployeesFromStorage();
    employee.id = new Date().getTime(); // unique ID
    employees.push(employee);
    this.saveEmployeesToStorage(employees);
  }

  updateEmployee(updated: Employee): void {
    let employees = this.getEmployeesFromStorage();
    employees = employees.map(emp => emp.id === updated.id ? updated : emp);
    this.saveEmployeesToStorage(employees);
  }

  deleteEmployee(id: number): void {
    const employees = this.getEmployeesFromStorage().filter(emp => emp.id !== id);
    this.saveEmployeesToStorage(employees);
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.getEmployeesFromStorage().find(emp => emp.id === id);
  }
}

// employee.service.ts
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [];
  private readonly STORAGE_KEY = 'employees_data';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this.employees = JSON.parse(data);
      } catch (error) {
        console.error('Error loading employees from localStorage:', error);
        this.employees = [];
      }
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.employees));
    } catch (error) {
      console.error('Error saving employees to localStorage:', error);
    }
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(employee: Employee): void {
    this.employees.push(employee);
    this.saveToStorage();
  }

  updateEmployee(index: number, employee: Employee): void {
    if (index >= 0 && index < this.employees.length) {
      this.employees[index] = employee;
      this.saveToStorage();
    }
  }

  deleteEmployee(index: number): void {
    if (index >= 0 && index < this.employees.length) {
      this.employees.splice(index, 1);
      this.saveToStorage();
    }
  }

  clearAllEmployees(): void {
    this.employees = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-home',
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = this.employeeService.getEmployees();
  }

  onEmployeeAdded() {
    this.loadEmployees();
  }

  removeEmployee(index: number) {
    this.employeeService.deleteEmployee(index);
    this.loadEmployees();
  }
}
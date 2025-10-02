import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // ✅ fixed typo (styleUrls not styleUrl)
  standalone: false,
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employeeToEdit: Employee | null = null;
  editIndex: number | null = null;

  searchTerm: string = '';
  selectedDepartment: string = 'All Departments';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = this.employeeService.getEmployees();
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.employees];

    // Search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search)
      );
    }

    // Department filter
    if (this.selectedDepartment !== 'All Departments') {
      result = result.filter(
        (emp) => emp.department === this.selectedDepartment
      );
    }

    this.filteredEmployees = result;
  }

  onEmployeeAdded() {
    this.loadEmployees();
    this.employeeToEdit = null;
    this.editIndex = null;
  }

  editEmployee(employee: Employee) {
    // Find index in original employees array
    const actualIndex = this.employees.findIndex(
      (emp) => emp.id === employee.id
    );

    this.employeeToEdit = { ...employee };
    this.editIndex = actualIndex;
  }

  removeEmployee(employee: Employee) {
    if (confirm('Are you sure you want to delete this employee?')) {
      const actualIndex = this.employees.findIndex(
        (emp) => emp.id === employee.id
      );

      if (actualIndex !== -1) {
        this.employeeService.deleteEmployee(actualIndex);
        this.loadEmployees();
      }
    }
  }

  exportCsv() {
    if (!this.filteredEmployees.length) {
      alert('No data to export!');
      return;
    }

    // Build CSV header
    const header = ['Name', 'Department', 'Email', 'Date of Joining'];
    const rows = this.filteredEmployees.map((emp) => [
      emp.name,
      emp.department,
      emp.email,
      new Date(emp.dateOfJoining).toLocaleDateString(),
    ]);

    // Convert to CSV string
    const csvContent = [header, ...rows]
      .map((e) => e.map((field) => `"${field}"`).join(','))
      .join('\n');

    // Download as file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

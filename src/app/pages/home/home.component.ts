import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employeeToEdit: Employee | null = null;
  editIndex: number | null = null;

  searchTerm: string = '';
  selectedDepartment: string = 'All Departments';

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees();
    this.applyFilters();
  }

  applyFilters(): void {
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

    // Sorting
    if (this.sortColumn) {
      result.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (this.sortColumn === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (this.sortColumn === 'dateOfJoining') {
          valA = new Date(a.dateOfJoining).getTime();
          valB = new Date(b.dateOfJoining).getTime();
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredEmployees = result;
  }

  editEmployee(employee: Employee): void {
    this.employeeToEdit = { ...employee };
    this.editIndex = this.employees.indexOf(employee);
  }

  removeEmployee(employee: Employee): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      const index = this.employees.indexOf(employee);
      if (index !== -1) {
        this.employeeService.deleteEmployee(index);
        this.employees.splice(index, 1); // Update local array
        this.applyFilters();
      }
    }
  }

  onEmployeeAdded(employee: Employee): void {
    if (this.editIndex !== null && this.employeeToEdit) {
      this.employeeService.updateEmployee(this.editIndex, employee);
    } else {
      this.employeeService.addEmployee(employee);
    }

    this.employees = this.employeeService.getEmployees();

    this.applyFilters();

    this.employeeToEdit = null;
    this.editIndex = null;
  }

  // Sorting toggle
  sortBy(column: 'name' | 'dateOfJoining'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  // Export CSV
  exportCSV(): void {
    const headers = ['Name', 'Department', 'Email', 'Date of Joining'];
    const rows = this.filteredEmployees.map((emp) => [
      emp.name,
      emp.department,
      emp.email,
      new Date(emp.dateOfJoining).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

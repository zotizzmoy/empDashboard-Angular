// employee-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee.component.html',
  standalone: false,
})
export class EmployeeComponent {
  @Output() employeeAdded = new EventEmitter<void>();
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', [Validators.required, this.noFutureDateValidator]]
    });
  }

  noFutureDateValidator(control: any) {
    if (!control.value) return null;
    const today = new Date();
    const selected = new Date(control.value);
    return selected > today ? { futureDate: true } : null;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;
      this.employeeService.addEmployee(employee);
      this.employeeForm.reset();
      this.employeeAdded.emit();
      (document.getElementById('closeModalBtn') as HTMLElement).click();
    }
  }
}

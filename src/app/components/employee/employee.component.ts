// employee-form.component.ts
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee.component.html',
  standalone: false,
})
export class EmployeeComponent implements OnChanges {
  @Output() employeeAdded = new EventEmitter<void>();
  @Input() employeeToEdit: Employee | null = null;
  @Input() editIndex: number | null = null;

  employeeForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', [Validators.required, this.noFutureDateValidator]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeToEdit'] && this.employeeToEdit) {
      this.isEditMode = true;
      this.employeeForm.patchValue(this.employeeToEdit);
    }
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

      if (this.isEditMode && this.editIndex !== null) {
        this.employeeService.updateEmployee(this.editIndex, employee);
      } else {
        this.employeeService.addEmployee(employee);
      }

      this.resetForm();
      this.employeeAdded.emit();
      (document.getElementById('closeModalBtn') as HTMLElement).click();
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.isEditMode = false;
    this.employeeToEdit = null;
    this.editIndex = null;
  }

  onModalClose() {
    this.resetForm();
  }
}

import {Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import {Employee} from "../model/employee";

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule]
})
export class EmployeeComponent {
  saving = false;
  error = '';
  private builder: FormBuilder = inject(FormBuilder);
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, Validators.required],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email]
  });

  get name(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('name'); }
  get dateOfBirth(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
  get city(): AbstractControl<string> {return <AbstractControl>this.employeeForm.get('city'); }
  get salary(): AbstractControl<number> {return <AbstractControl<number>>this.employeeForm.get('salary'); }
  get gender(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('gender'); }
  get email(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('email'); }

  async onSubmit(): Promise<void> {
    if (this.saving) return;
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const employee: Employee = new Employee(this.name.value,
      new Date(`${this.dateOfBirth.value}T00:00:00`),
      this.city.value,
      this.salary.value,
      this.gender.value,
      this.email.value);
    try {
      await this.employeeService.addEmployee(employee);
    } catch (error: unknown) {
      console.error('Employee save failed:', error);
      this.error = 'Impossible d’enregistrer cet employé. Vérifiez la connexion et les autorisations Firestore, puis réessayez.';
      this.saving = false;
      return;
    }

    this.employeeForm.reset({ salary: 0 });
    try {
      const navigated = await this.router.navigate(['/employees']);
      if (!navigated) this.error = 'Employé enregistré, mais la navigation a échoué. Ouvrez Employee List.';
    } catch (error: unknown) {
      console.error('Navigation failed:', error);
      this.error = 'Employé enregistré, mais la navigation a échoué. Ouvrez Employee List.';
    } finally {
      this.saving = false;
    }
  }
}

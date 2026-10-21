import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeComponent } from './employee.component';
import { EmployeeService } from '../service/employee.service';
import { provideRouter, Router } from '@angular/router';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let save: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    save = jasmine.createSpy('addEmployee');
    TestBed.configureTestingModule({
    imports: [EmployeeComponent],
    providers: [provideRouter([]), { provide: EmployeeService, useValue: { addEmployee: save } }]
});
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.employeeForm.setValue({
      name: 'Test Employee', dateOfBirth: '2000-05-10', city: 'Ottawa',
      salary: 45000.5, gender: 'X', email: 'test@example.com'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('waits for confirmation and blocks duplicate submissions', async () => {
    let confirm!: (id: string) => void;
    save.and.returnValue(new Promise<string>(resolve => { confirm = resolve; }));
    const pending = component.onSubmit();
    await component.onSubmit();
    expect(save).toHaveBeenCalledTimes(1);
    expect(component.saving).toBeTrue();
    expect(component.name.value).toBe('Test Employee');
    expect(navigate).not.toHaveBeenCalled();
    expect(save.calls.mostRecent().args[0].salary).toBe(45000.5);
    expect(save.calls.mostRecent().args[0].dateOfBirth instanceof Date).toBeTrue();
    confirm('document-id');
    await pending;
    expect(component.name.value).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/employees']);
    expect(component.saving).toBeFalse();
  });

  it('preserves input on failure and allows retry', async () => {
    spyOn(console, 'error');
    const original = component.employeeForm.getRawValue();
    save.and.rejectWith(new Error('permission-denied'));
    await component.onSubmit();
    expect(component.employeeForm.getRawValue()).toEqual(original);
    expect(component.error).toBeTruthy();
    expect(component.saving).toBeFalse();
    expect(navigate).not.toHaveBeenCalled();
    save.and.resolveTo('retry-id');
    await component.onSubmit();
    expect(save).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalled();
  });

  it('does not submit an invalid form', async () => {
    component.employeeForm.patchValue({ name: '' });
    await component.onSubmit();
    expect(save).not.toHaveBeenCalled();
  });
});

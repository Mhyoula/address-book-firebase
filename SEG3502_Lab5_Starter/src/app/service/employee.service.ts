import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, Timestamp } from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from "rxjs";
import {Employee} from "../model/employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly firestore = inject(Firestore);
  // Existing list contract retained for the partner's Firestore reading work.
  employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  async addEmployee(employee: Employee): Promise<string> {
    if (!Number.isFinite(employee.salary) ||
        !(employee.dateOfBirth instanceof Date) ||
        !Number.isFinite(employee.dateOfBirth.getTime())) {
      throw new Error('Invalid employee salary or date of birth.');
    }
    const document = await addDoc(collection(this.firestore, 'employees'), {
      name: employee.name,
      dateOfBirth: Timestamp.fromDate(employee.dateOfBirth),
      city: employee.city,
      salary: employee.salary,
      gender: employee.gender ?? '',
      email: employee.email ?? ''
    });
    return document.id;
  }
}

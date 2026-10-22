
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  Timestamp
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly firestore = inject(Firestore);

  employees$: BehaviorSubject<readonly Employee[]> =
    new BehaviorSubject<readonly Employee[]>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    const employeesCollection = collection(this.firestore, 'employees');

    collectionData(employeesCollection, { idField: 'id' }).subscribe({
      next: (documents) => {
        const employees: Employee[] = documents.map((document) => {
          const dateValue = document['dateOfBirth'];

          return new Employee(
            String(document['name'] ?? ''),
            dateValue instanceof Timestamp
              ? dateValue.toDate()
              : dateValue instanceof Date
                ? dateValue
                : new Date(String(dateValue)),
            String(document['city'] ?? ''),
            Number(document['salary'] ?? 0),
            String(document['gender'] ?? ''),
            String(document['email'] ?? '')
          );
        });

        this.employees$.next(employees);
        this.error$.next(null);
        this.loading$.next(false);
      },
      error: (error) => {
        console.error('Erreur lors de la lecture des employés :', error);
        this.error$.next('Impossible de charger les employés. Réessaie plus tard.');
        this.loading$.next(false);
      }
    });
  }

  async addEmployee(employee: Employee): Promise<string> {
    if (
      !Number.isFinite(employee.salary) ||
      !(employee.dateOfBirth instanceof Date) ||
      !Number.isFinite(employee.dateOfBirth.getTime())
    ) {
      throw new Error('Invalid employee salary or date of birth.');
    }

    const document = await addDoc(
      collection(this.firestore, 'employees'),
      {
        name: employee.name,
        dateOfBirth: Timestamp.fromDate(employee.dateOfBirth),
        city: employee.city,
        salary: employee.salary,
        gender: employee.gender ?? '',
        email: employee.email ?? ''
      }
    );

    return document.id;
  }
}

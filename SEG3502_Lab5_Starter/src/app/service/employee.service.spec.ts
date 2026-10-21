import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { Firestore } from '@angular/fire/firestore';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Firestore, useValue: {} }] });
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

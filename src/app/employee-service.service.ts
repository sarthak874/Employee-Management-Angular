import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface Employee {
  id?: number;
  name: string;
  salary: any;
  age: any;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeServiceService {
  private employeesUrl = 'http://localhost:3001/employees';
  private searchTermSource = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSource.asObservable();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.employeesUrl)
      .pipe(catchError(this.handleError<Employee[]>('getEmployees', [])));
  }

  /** ADD a new employee to the server */
  addEmployee(employee: Employee): Observable<Employee> {
    return this.getEmployees().pipe(
      map((employees) => {
        console.log(employees);
        const maxId = employees.length
          ? Math.max(...employees.map((e) => e.id))
          : 0;
        employee.id = maxId + 1;
        return employee;
      }),
      switchMap((newEmployee) =>
        this.http.post<Employee>(
          this.employeesUrl,
          newEmployee,
          this.httpOptions
        )
      ),
      catchError(this.handleError<Employee>('addEmployee'))
    );
  }

  /** UPDATE an existing employee on the server */
  updateEmployee(employee: Employee): Observable<any> {
    const url = `${this.employeesUrl}/${employee.id}`;
    return this.http
      .put(url, employee, this.httpOptions)
      .pipe(catchError(this.handleError<any>('updateEmployee')));
  }

  /** DELETE an employee from the server */
  deleteEmployee(id: number): Observable<Employee> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http
      .delete<Employee>(url, this.httpOptions)
      .pipe(catchError(this.handleError<Employee>('deleteEmployee')));
  }

  updateSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }

  /** Handle Http operation that failed. */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}

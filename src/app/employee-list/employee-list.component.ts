import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeServiceService } from '../employee-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: any[];
  employeeToDelete: Employee | null = null;
  successMessage: string | null = null;
  employeeToView: Employee | null = null;
  filteredEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();

    this.employeeService.searchTerm$.subscribe((term) => {
      this.filteredEmployees = this.employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(term.toLowerCase()) || []
      );
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { message: string };

    if (state && state.message) {
      this.successMessage = state.message;
      setTimeout(() => (this.successMessage = null), 3000); // Hide message after 3 seconds
    }
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response) => {
        this.filteredEmployees = response;
        this.employees = response;
        console.log(this.employees);
      },
      (error) => console.error('Error fetching employees', error)
    );
  }

  confirmDelete(employee: Employee): void {
    console.log(employee);
    this.employeeToDelete = employee;
  }

  deleteEmployee(): void {
    if (this.employeeToDelete) {
      this.employeeService
        .deleteEmployee(this.employeeToDelete.id)
        .subscribe(() => {
          this.employees = this.employees.filter(
            (e) => e.id !== this.employeeToDelete!.id
          );
          this.filteredEmployees = this.filteredEmployees.filter(
            (e) => e.id !== this.employeeToDelete!.id
          );
          // this.fetchEmployees();
          this.closeModal();
        });
    }
  }

  closeModal(): void {
    this.employeeToDelete = null;
  }

  editEmployee(employee: Employee): void {
    console.log(employee);
    this.router.navigate(['/edit', employee.id], { state: { employee } });
  }

  viewDetails(employee: Employee): void {
    console.log(employee);
    this.employeeToView = employee;
  }

  closeDetails(): void {
    this.employeeToView = null;
  }
}

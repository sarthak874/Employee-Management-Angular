import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeServiceService } from '../employee-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
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
          employee.name.toLowerCase().includes(term.toLowerCase())
      );
    });

    this.employeeService.currentMessage.subscribe((message) => {
      this.successMessage = message;
      if (message) {
        setTimeout(() => this.employeeService.clearMessage(), 3000); // Clear message after 3 seconds
      }
    });
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response) => {
        this.employees = response;
        this.filteredEmployees = response;
        console.log(this.employees);
      },
      (error) => console.error('Error fetching employees', error)
    );
  }

  confirmDelete(employee: Employee): void {
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
          this.employeeService.changeMessage('Employee deleted successfully!');
        });
    }
  }

  closeModal(): void {
    this.employeeToDelete = null;
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/edit', employee.id], { state: { employee } });
  }

  viewDetails(employee: Employee): void {
    this.employeeToView = employee;
  }

  closeDetails(): void {
    this.employeeToView = null;
  }
}

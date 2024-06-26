import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeServiceService } from '../employee-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: Employee | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { employee: Employee };
    const employee = state ? state.employee : { name: '', salary: 0, age: 0 };

    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit(): void {
    // const state = history.state as { employee: Employee };
    // if (state && state.employee) {
    //   this.employee = state.employee;
    //   this.employeeForm.patchValue(this.employee);
    // }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      const state = history.state as { employee: Employee };
      if (state && state.employee) {
        this.employee = state.employee;
        this.employeeForm.patchValue(this.employee);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = this.employeeForm.value;
      if (this.isEditMode && employeeData.id) {
        console.log(employeeData);
        this.employeeService.updateEmployee(employeeData).subscribe((updatedEmployee) => {
          if(updatedEmployee){
            this.employeeService.changeMessage('Employee updated successfully!');
          }
          this.router.navigate(['/employees']);
        });
      } else {
        // console.log(employeeData)
        this.employeeService
          .addEmployee(employeeData)
          .subscribe((newEmployee) => {
            if(newEmployee){
              this.employeeService.changeMessage(
                'Employee created successfully!'
              );
            }
            this.router.navigate(['/employees']);
          });
      }
    }
  }
}

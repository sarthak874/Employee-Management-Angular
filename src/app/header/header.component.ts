import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EmployeeServiceService } from '../employee-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isEmployeeListRoute: boolean = false;
  searchText: string = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeServiceService
  ) {
    //show search bar only on navigation to employees list route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isEmployeeListRoute = this.router.url === '/employees';
      }
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    // console.log(this.searchText)
    this.employeeService.updateSearchTerm(this.searchText);
  }
}

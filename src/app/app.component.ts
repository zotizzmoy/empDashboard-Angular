import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  

  constructor(private router: Router) {}
   isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  handleLogout() {
    // Example: show alert and navigate to login page
    alert('Logged out!');
    this.router.navigate(['/login']); // make sure you have a login route
  }
}

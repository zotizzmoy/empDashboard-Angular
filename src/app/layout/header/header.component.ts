import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.onLogout.emit();
  }
}

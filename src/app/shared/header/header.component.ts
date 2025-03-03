import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showDeleteConfirmation = false;

  constructor(private router: Router) {}

  openLogoutModal(){
    this.showDeleteConfirmation = true;
  }
  confirmDelete(){
    this.logout();
  }
  logout() {
    localStorage.removeItem('token');  
    localStorage.removeItem('role');  
    localStorage.removeItem('userId');  
    this.router.navigate(['/login']); 
    this.showDeleteConfirmation = false;
  }
}

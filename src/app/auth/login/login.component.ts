import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService,
     private router: Router,
     private toastr:ToastrService,
     private fb:FormBuilder
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  login() {
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.authService.login(user).subscribe({
      next: (response) => {
        localStorage.setItem('userId', JSON.stringify({ userId: response.userId}));
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        this.router.navigate(['/events']);
        console.log(response,'login')
        this.toastr.success('User Logged in Successfully');

      },
      error: (error) => {
        console.log(error)
        this.toastr.error('User LoggedIn Error');
      }
    })
  }
}

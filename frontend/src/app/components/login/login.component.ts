import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.authService.login(username, password).toPromise();
      console.log(response);
      if (response && response.user) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));

        // Set a timeout to clear the user from localStorage after 24 hours
        setTimeout(() => {
          localStorage.removeItem('user');
        }, 24 * 60 * 60 * 1000); // 24 hours

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

}

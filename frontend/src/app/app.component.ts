import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import {AuthService} from "./services/auth.service";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  username: string = 'jopica123@gmail.com';
  password: string = 'Tp-link123';

  constructor(private authService: AuthService){
  }

  ngOnInit(): void {
    initFlowbite();
  }

}

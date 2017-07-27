import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { NgForm } from '@angular/forms'
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user:User;

  // inputs = ['Email', 'Username', 'Password', 'Repeat password'];

  constructor(private api:ApiService) { };

  ngOnInit() {
    this.user = new User();

  }

  onSubmit(form:NgForm){
    console.log(this.user);
    this.api.registerUser(this.user);
  }

}

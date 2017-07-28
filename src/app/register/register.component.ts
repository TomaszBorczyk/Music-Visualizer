import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
// import { NgForm } from '@angular/forms'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user:User;
  registerForm:FormGroup;
  active:boolean;

  constructor(private api:ApiService, private fb:FormBuilder) { };

  ngOnInit():void {
    this.active = true;
    this.user = new User('', '', '');
    this.buildForm();
  }

  buildForm():void{
    this.registerForm = this.fb.group({
      'username': [this.user.username,[
          Validators.required,
          Validators.minLength(4)
        ]
      ],
      'email': [this.user.email, [
          Validators.required,
          Validators.email,
        ]
      ],
      'password': [this.user.password, [
          Validators.required,
          Validators.minLength(5)
        ]
      ],
      'rePassword':['',[
        Validators.required,
        ]
      ]
    }, {validator: this.areEqual});

    this.registerForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );

    this.onValueChanged();
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.user = new User(
                  this.registerForm.get('username').value,
                  this.registerForm.get('email').value,
                  this.registerForm.get('password').value
                          );
      console.log(this.user);
      this.api.registerUser(this.user);
    }
  }

  onValueChanged(data?: any){
    if(!this.registerForm) return;
    const form = this.registerForm;

    for(const field in this.formErrors){
      this.formErrors[field] = '';
      const control = form.get(field);

      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          console.log(field, key, messages[key]);
          this.formErrors[field] += messages[key];
        }
      }
    }
  }

  areEqual(ac: AbstractControl){
    let passwordValue = ac.get('password').value;
    let rePasswordValue = ac.get('rePassword').value;

    if(passwordValue!=rePasswordValue){
      ac.get('rePassword').setErrors( {notequal: true});
      console.log('dont match');
    } else{
      console.log('equal');
      return null;
    }

  }

  formErrors = {
    'username': '',
    'email': '',
    'password': '',
    'rePassword': '',
  }

  validationMessages = {
    'username': {
      'required': 'Username is required',
      'minlength': 'Username must be at least 4 characters long'
    },

    'email': {
      'required': 'Email is required',
      'email': 'Please enter correct email'
    },

    'password': {
      'required': 'Password is required',
      'minlength': 'Password must be at least 5 characters long'

    },

    'rePassword': {
      'required': 'Password confirmation is required',
      'notequal': 'Does not mach'
    }
  }

}

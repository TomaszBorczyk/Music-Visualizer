import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class ApiService{
  apiServer:string = 'http://127.0.0.1:4567/api/v1/';

  constructor(private http:Http){};

  registerUser(user:User){
    let body = JSON.stringify(user);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(body);
    this.http.post(this.apiServer + 'user/register', body, options)
              .subscribe(
                data => console.log(data),
                err => console.log(err)
              );
  }

}

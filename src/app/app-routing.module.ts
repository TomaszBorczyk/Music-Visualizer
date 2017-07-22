import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MusicComponentComponent} from './music-component/music-component.component';
import {RegisterComponent} from './register/register.component';

@NgModule({
  imports:[
    RouterModule.forRoot([
      {path: 'play', component: MusicComponentComponent},
      {path: 'register', component: RegisterComponent},
      {path: '', redirectTo: 'play', pathMatch: 'full'},
      {path: '**', redirectTo: 'play', pathMatch: 'full'},
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

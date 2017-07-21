import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MusicComponentComponent } from './music-component/music-component.component';
import { AudioContextModule } from 'angular-audio-context';



@NgModule({
  declarations: [
    AppComponent,
    MusicComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AudioContextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

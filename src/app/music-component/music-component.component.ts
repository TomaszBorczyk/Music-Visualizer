import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Inject, Injectable } from '@angular/core';

declare var audioVisualizer : any;

@Component({
  selector: 'app-music-component',
  templateUrl: './music-component.component.html',
  styleUrls: ['./music-component.component.scss'],
})

@Injectable()
export class MusicComponentComponent implements OnInit {
  ngOnInit() {

  };

  ngAfterViewInit() {
    audioVisualizer.init();
  }


}

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
  analyser:any;
  canvasCtx:any;
  @ViewChild('canvas') canvas:ElementRef;
  @ViewChild('player') player:ElementRef;
  canvasWidth:number;
  canvasHeight:number;
  dataArray:Uint8Array;
  bufferLength;
  source;
  testAudioCtx;

  generateObj:any;

  ngOnInit() {


  };

  ngAfterViewInit() {
    audioVisualizer.init();
    audioVisualizer.visualize();
  }




}

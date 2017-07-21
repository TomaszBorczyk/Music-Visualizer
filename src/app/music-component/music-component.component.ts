import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Inject, Injectable } from '@angular/core';
import { AudioContext  } from 'angular-audio-context';

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

  constructor(@Inject(AudioContext) private audioContext) { }

  ngOnInit() {

    audioVisualizer.init();
    audioVisualizer.visualize();
  };

  ngAfterViewInit() {

  }




}

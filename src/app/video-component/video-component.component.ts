import { Component, OnInit } from '@angular/core';
import { Inject, Injectable } from '@angular/core';
import { AudioContext  } from 'angular-audio-context';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.css'],
})

@Injectable()
export class VideoComponentComponent implements OnInit {

  constructor(@Inject(AudioContext) private audioContext) { }

  ngOnInit() {
    console.log(this.audioContext.sampleRate);
    var analyser = this.audioContext.createAnalyser();

  }

}

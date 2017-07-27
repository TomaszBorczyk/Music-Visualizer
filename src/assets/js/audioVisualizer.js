
'use strict'

//visualization
let canvas;
let canvasCtx;

//audio tag
let player;

//controls - buttons
let play;
let trackHead;
let timeline;
let trackTimelineProgress;

let volume;
let volumeHead;
let volumeline;
let volumeProgress;

//icons
let playIcon;
let volIcon;

//audio nodes
let audioContext;
let analyser;
let source;

const audioVisualizer ={


  init: function(){
    audioVisualizer.controlsInit();
    audioVisualizer.listenersInit();
    audioVisualizer.audioAnalyseInit();

    audioVisualizer.controls.startPlay();

    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas(){
      canvas.width=window.innerWidth*0.9;
      audioVisualizer.visualize();
    }
    resizeCanvas();

  },

  controlsInit:  function(){
      canvas = document.getElementById('visualizer');
      canvasCtx = canvas.getContext("2d");

      player = document.getElementById('player');

      play = document.getElementById('play');
      trackHead = document.getElementById('trackHead');
      timeline = document.getElementById('trackTimelineWrapper');
      trackTimelineProgress = document.getElementById('trackTimelineProgress');

      volume = document.getElementById('volume-controller');
      volumeHead = document.getElementById('volumeHead');
      volumeline = document.getElementById('volumeSliderWrapper');
      volumeProgress = document.getElementById('volumeProgress');

      playIcon = document.getElementById('play-icon');
      volIcon = document.getElementById('volume-icon');

      volumeProgress.style.width = player.volume*100 +'%';
      volIcon.className = "icon-speaker_" + Math.min(3, Math.ceil(player.volume*10/3.33))+"_sound control-icon"
    },

    listenersInit: function(){
      let isDraggedTrack = false;
      let isDraggedVolume = false;
      let isDraggedTouch = false;
      let duration;

      player.addEventListener("canplaythrough", getDuration);
      player.addEventListener("timeupdate", timeUpdate);
      player.onended = () => {
        playIcon.classList.add('icon-play');
        playIcon.classList.remove('icon-pause');
      }

      window.addEventListener('mouseup', headDropped);

      //controls
      play.addEventListener('click', audioVisualizer.controls.startPlay);
      trackHead.addEventListener('mousedown', dragStart_Trackhead);
      // trackHead.addEventListener('touchstart', dragTouch);

      //move trackhead and update current time when clicking on timeline
      timeline.addEventListener('click', function(event){
        moveHead(event, trackTimelineProgress, timeline);
        player.currentTime = duration * getClickPercent(event, timeline);
      });

      volume.addEventListener('click', audioVisualizer.controls.volumeMute);
      volumeHead.addEventListener('mousedown', dragStart_Volumehead);
      volumeline.addEventListener('click', function(event){
        moveHead(event, volumeProgress, volumeline);
        let newVol = getClickPercent(event, volumeline);
        changeVolume(newVol);
      });



      //get number [0,1] representing percent of track time
      function getClickPercent(event, progress){
        // if(isDraggedTouch==1){
        //   let touchobj = event.changedTouches[0] // reference first touch point (ie: first finger)
        //   let startx = parseInt(touchobj.clientX)
        //   return (startx - timeline.getBoundingClientRect().left)/timeline.clientWidth;
        // }
        let value = (event.clientX - progress.getBoundingClientRect().left)/progress.clientWidth;
        return value;
      }

      //get track duration
      function getDuration(){
        duration = player.duration;
      }

      //function to drag trackHead
      function dragStart_Trackhead(){
        isDraggedTrack = true;
        window.addEventListener('mousemove', dragMouse_Trackhead);
        player.removeEventListener('timeupdate', timeUpdate);
      }

      //function to drag volumeHead
      function dragStart_Volumehead(){
        isDraggedVolume = true;
        window.addEventListener('mousemove', dragMouse_Volumehead);
      }

      //update trackhead and current time when dragging
      function dragMouse_Trackhead(event){
        moveHead(event, trackTimelineProgress, timeline);
        //live time update of track time in regard of trackhead position
        player.currentTime = duration * getClickPercent(event, timeline);
      }

      function dragMouse_Volumehead(event){
        if(player.muted==true){
          player.muted=false;
        }
        moveHead(event, volumeProgress, volumeline);
        //live time update of track time in regard of trackhead position
        let newVol = getClickPercent(event, volumeline);
        changeVolume(newVol);
      }

      function changeVolume(newVol){
        if(newVol<=0){
          newVol =0;
        } else if(newVol>=1){
          newVol=1;
        }
          volIcon.className = "icon-speaker_" + Math.min(3, Math.ceil(newVol*10/3.33))+"_sound control-icon"
          player.volume = newVol;
      }

      function dragTouch(){
        isDraggedTouch = true;
        window.addEventListener('touchmove', dragMouseTouch);
        player.removeEventListener('timeupdate', timeUpdate);
      }

      function dragMouseTouch(event){
        moveTrackHead(event);
        //live time update of track time in regard of trackhead position
        player.currentTime = duration * getClickPercent(event, timeline);
      }

      //move trackhead when clicked
      function moveHead(event, progressBar, maxProgress){
        let newWidth = getClickPercent(event, maxProgress)*100;
        if(newWidth<=0){
          progressBar.style.width =  0 +'%'
        }
        else if(newWidth>0 && newWidth < 100){
          progressBar.style.width =  newWidth +'%'
        } else if(newWidth > 100){
          progressBar.style.width =  100 +'%'
        }

      }

      //move trackhead when track is playing
      function timeUpdate() {
        let playPercent = 100 * (player.currentTime / duration);
        trackTimelineProgress.style.width =  playPercent +'%'
      }

      //update current track time when trackhead is dropped
      function headDropped(event){
        if(isDraggedTrack==true){
          isDraggedTrack = false;
          moveHead(event, trackTimelineProgress, timeline);
          player.currentTime = duration * getClickPercent(event, timeline);
          console.log('track head dropped');
          window.removeEventListener('mousemove', dragMouse_Trackhead);
          player.addEventListener('timeupdate', timeUpdate);
        }
        else if(isDraggedVolume==true){
          isDraggedVolume = false;
          moveHead(event, volumeProgress, volumeline);
          changeVolume(getClickPercent(event, volumeline));
          console.log('vol head dropped');
          window.removeEventListener('mousemove', dragMouse_Volumehead);
        }
      }
  }, //end of controlsInit

  audioAnalyseInit: function(){
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(player);
    source.connect(audioContext.destination);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }, //end of audioAnalyseInit


  visualize: function(){
    //setup
    let height = canvas.height;
    let width = canvas.width;
    analyser.fftSize = 512;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, width, height);

    let draw = function(){
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, width, height);

      let barWidth = (width/bufferLength)*2.5;
      let barHeight;
      let x = 0;

      for(let i =0; i<bufferLength; i++){
        barHeight = dataArray[i];
        canvasCtx.fillStyle = 'rgb(0,120,100)';
        canvasCtx.fillRect(x, height-barHeight/2, barWidth, barHeight/2);
        x += barWidth +1;
      }
    }
    draw();
  }, //end of visualize

  controls: {
    startPlay: ()=>{
      if(player.paused){
        player.play();
        playIcon.classList.remove('icon-play');
        playIcon.classList.add('icon-pause');
      }
      else{
        player.pause();
        playIcon.classList.add('icon-play');
        playIcon.classList.remove('icon-pause');
      }
    }, //end of play

    volumeMute: ()=>{
      if(player.muted){
        player.muted = false;
        volIcon.className = "icon-speaker_" + Math.min(3, Math.ceil(player.volume*10/3.33))+"_sound control-icon"
        volumeProgress.style.width = player.volume*100 +'%';

      } else{
        player.muted = true;
        volIcon.className = " icon-speaker_muted control-icon"
        volumeProgress.style.width = 0 +'%';

      }
    }

  }

} //end of audioVisualizer

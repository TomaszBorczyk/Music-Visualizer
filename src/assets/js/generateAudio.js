
var audioVisualizer ={
  init: function(){
    audioVisualizer.controlsInit();
    audioVisualizer.audioAnalyseInit();

    window.addEventListener('resize', resizeCanvas);
    function resizeCanvas(){
      canvas.width=window.innerWidth*0.9;
      audioVisualizer.visualize();
    }
    resizeCanvas();

  },

  controlsInit:  function(){
      console.log("generate vis");
      canvas = document.getElementById('visualizer');
      canvasCtx = canvas.getContext("2d");
      player = document.getElementById('player');
      play = document.getElementById('play');
      trackHead = document.getElementById('trackHead');
      timeline = document.getElementById('trackTimelineWrapper');

      var isTrackheadDragged = false;
      var duration;

      player.addEventListener("canplaythrough", getDuration);
      player.addEventListener("timeupdate", timeUpdate);

      //controls
      play.addEventListener('click', audioVisualizer.controls.play);
      trackHead.addEventListener('mousedown', drag);
      window.addEventListener('mouseup', trackHeadDropped);

      //get track duration
      function getDuration(){
        duration = player.duration;
      }

      //function to drag trackHead
      function drag(){
        isTrackheadDragged = true;
        trackHead.className = 'grabbed';
        window.addEventListener('mousemove', dragMouse);
        player.removeEventListener('timeupdate', timeUpdate);

      }

      //update trackhead and current time when dragging
      function dragMouse(event){
        moveTrackHead(event);
        //live time update of track time in regard of trackhead position
        player.currentTime = duration * getClickPercent(event);
      }

      //update current track time when trackhead is dropped
      function trackHeadDropped(event){
        if(isTrackheadDragged==true){
          isTrackheadDragged = false;
          trackHead.className = 'to-grab';
          moveTrackHead(event);
          player.currentTime = duration * getClickPercent(event);
          console.log('track head dropped');
          window.removeEventListener('mousemove', dragMouse);
          player.addEventListener('timeupdate', timeUpdate);
        }
      }

      //move trackhead and update current time when clicking on timeline
      timeline.addEventListener('click', function(event){
        moveTrackHead(event);
        player.currentTime = duration * getClickPercent(event);
      })

      //get number [0,1] representing percent of track time
      function getClickPercent(event){
          return (event.clientX - timeline.getBoundingClientRect().left)/timeline.clientWidth;
      }

      //move trackhead when clicked
      function moveTrackHead(event){
        var newMargin = getClickPercent(event)*100;

        // trackHead.style.marginLeft = newMargin +'%';

        if(newMargin<=0){
          trackHead.style.marginLeft = 0 +'%';
        }
        else if(newMargin>0 && newMargin < 100){
          trackHead.style.marginLeft = newMargin +'%';
        } else if(newMargin > 100){
          trackHead.style.marginLeft = 100 +'%';
        }

      }

      //move trackhead when track is playing
      function timeUpdate() {
      	var playPercent = 100 * (player.currentTime / duration);
      	trackHead.style.marginLeft = playPercent + "%";
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
    var height = canvas.height;
    var width = canvas.width;
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, width, height);

    var draw = function(){
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, width, height);

      var barWidth = (width/bufferLength)*2.5;
      var barHeight;
      var x = 0;

      for(var i =0; i<bufferLength; i++){
        barHeight = dataArray[i];
        canvasCtx.fillStyle = 'rgb(0,120,100)';
        canvasCtx.fillRect(x, height-barHeight/2, barWidth, barHeight/2);
        x += barWidth +1;
      }
    }
    draw();
  }, //end of visualize

  controls: {
    play: function(){
      if(player.paused){
        player.play();
        play.style.backgroundImage = 'url(../../assets/svg/play_button_clean.svg)';
      }
      else{
        player.pause();
        play.style.backgroundImage = 'url(../../assets/svg/pause_button_clean.svg)';
      }
    }, //end of play


  }



} //end of audioVisualizer


var audioVisualizer ={

  init:  function(){
      console.log("generate vis");
      player = document.getElementById('player');
      canvas = document.getElementById('visualizer');
      canvasCtx = canvas.getContext("2d");

      //controls
      play = document.getElementById('play');
      play.addEventListener('click', audioVisualizer.controls.play);

      window.addEventListener('resize', resizeCanvas, false);

      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();

      source = audioContext.createMediaElementSource(player);
      source.connect(audioContext.destination);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      function resizeCanvas(){
        canvas.width=window.innerWidth*0.9;
        audioVisualizer.visualize();
      }
      resizeCanvas();
  }, //end of init

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
      }
      else{
        player.pause();
      }
    }, //end of play


  }



} //end of audioVisualizer

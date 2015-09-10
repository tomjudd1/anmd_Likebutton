/* Author: 
Tom Judd	
*/
var eyeMovement = 15;
var eyeTweakX = -2;
var eyeTweakY = -6;

var click = false;
var frameWidth = 290;
var totalFrames1 = 15;
var totalFrames2 = 26;


var iphone = false;
var clickFace = false;
var currentFrame = 1;

var ended = false;
jQuery(document).ready(function(){
	


	if($(window).width() < 450 ){
		iPhone();
	}else{
		cpu();
	}
	

   // eye move
   $(document).mousemove(function(e){
   	


   	var x = e.pageX ;
   	var y = e.pageY;

   	if(y < 400 && !click && !iphone){
		$('#face').css({backgroundPosition: "0px 0px" });
	}

	// Get decimal percentage of mouse x of screen
	// half way = 1
	// edge of window = 0
	
	var w = $(window).width();
	var h = 600;
	
	var nX = 1 - Math.abs((x - w)/w);
	var nY = 1 - Math.abs((y - h)/h);
	
	if(y > h){ nY = 1 };
	
	// eye movment
	var eyeX = (eyeMovement * nX) - (eyeMovement/2) + eyeTweakX;
	var eyeY = (eyeMovement * nY) - (eyeMovement/2) + eyeTweakY;


	// MOVE EYES
	$("#eye1").css("margin-left", eyeX);
	$("#eye1").css("margin-top", eyeY);
	
	$("#eye2").css("margin-left", eyeX);
	$("#eye2").css("margin-top", eyeY);

	// update frame number output text
	$("#zone").find('#frame').text("Frame #" + eyeX);

   });


	// face animation 
   $("#zone").mousemove(function(e){
	
	if(click || iphone){ return; }
	
   	var x = e.pageX - this.offsetLeft;
   	var y = e.pageY - this.offsetTop;
	
	var nX = 1 - Math.abs((x - 150)/150);
	var nY = 1 - Math.abs((y - 100)/100);
	
	var vect = nX * nY;

	var frameNo = Math.ceil(vect * totalFrames1);
	var frame = 0;

	// change face
	frame = - frameNo * frameWidth;
	frame = frame+"px 0px";


    
	// move to frame
	$('#face').css({backgroundPosition: frame });
	
	// update frame number output text
	$("#zone").find('#frame').text("Frame #" + frameNo);
	

   });

	// tap to smile
	
	$("#face").click(function(e){
		if(clickFace || !iphone){ return; }
		playStart();
		//set an interval
		setInterval(playStart, 12);
		clickFace = true;
	});

  //  $("#zone").click(function(e){
  //  	
  //  	if(click){ return; }
  //  	
  //  	$("#eye1, #eye2").css('display', 'none');
  //  	
  //  	click = true;
  //  	
  //      //set an interval
  //  	setInterval(playOut, 10);
  //
  //      //Call the function
  //      playOut();
  //  
  //  });
	



});


var playStartCount = 1;

function playStart(){
	// exit if on final frame
    if(playStartCount >= totalFrames1){  	$("#tap").hide(); $("#tap2").show();
	
		$("#fb").fadeIn(); return; }
	var frame = 0;
	// play next frame in sequence
	frame = - playStartCount * frameWidth;
	frame = frame+"px 0px";
	// move to frame
	$('#face').css({backgroundPosition: frame });
	playStartCount++;
}




var playOutCount = totalFrames1;

function playOut(){
	// exit if on final frame
    if(playOutCount>= totalFrames2){ 
		$("#fb").hide();
		$("#tap2").hide();
	return; }
	var frame = 0;
	// play next frame in sequence
	frame = - playOutCount * frameWidth;
	frame = frame+"px 0px";
	// move to frame
	$('#face').css({backgroundPosition: frame });
	playOutCount++;
}




function liked(){
	
	ended = true;
	
	if(click){ return; }

	$("#eye1, #eye2").css('display', 'none');
	
	click = true;
	
    //set an interval
	setInterval(playOut, 12);

    //Call the function
    playOut();	
	$("#thanks").fadeIn();

};


function iPhone(){
	
	frameWidth = 200;
	iphone = true;
	$("#fb").hide();
	$("#tap2").hide();
	$("header").hide();
	if(ended){
		// change face
		frame = - 25 * frameWidth;
		frame = frame+"px 0px";
		$('#face').css({backgroundPosition: frame });
		return;
	}
	$("#tap").show();
	
	$('#face').css({backgroundPosition: "0px 0px" });
	
}

function cpu(){
	
	frameWidth = 290;
	iphone = false;
	$("#fb").show();
	$("#tap").hide();
	$("#tap2").hide();
	$("header").show();
	if(ended){
		// change face
		frame = - 25 * frameWidth;
		frame = frame+"px 0px";
		$('#face').css({backgroundPosition: frame });
		return;
	}
	
	$('#face').css({backgroundPosition: "0px 0px" });

}

$(window).resize(function() {

	if( !iphone && $(window).width() < 450 ){
		iPhone();
	}
	if(iphone && $(window).width() >= 450){
		cpu();
	}
	
});








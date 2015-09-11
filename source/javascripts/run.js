// Activation

function run(){

	// currently testing with desktop as mobile so switch on ! to run properly
	// If touch then explain we need a mouse
	if(Modernizr.touch){
		$("#noMouse").show();
		$("#twitter").show();

		// add Analytics to link click

		$('#noMouse').find('a').on('click', function() {
		  ga('send', 'event', 'email link', 'click');
		});


	}
	// If browser then run as normal
	else{	
		init();
		$("body").css("background-color", "#ebff71");
		$("#about").find("h3").css("color", "#333333");
  $("#fb").show();
  $("#title").show();
	}

	// Analytics for about link
	$('#about').find('a').on('click', function() {
		 ga('send', 'event', 'about link', 'click');
	});

}
var container, stats;
var camera, scene, renderer;
var geometry, particleGeometry, thumbMesh, particleMaterial, wall, head, mouth, innerMouth, pupilMaterial, innerMouthShape, innerMouthGeometry, curve, browCurve, body, brow, mouthGeometry, browGeometry, wall, wallGeometry, hole;
var lLidTop, lLidBottom, rLidTop, rLidBottom;

var mouseOut = false;

var distanceMax = 86;
var distanceFromGoal = 0;
var offScreen = true;
var followPoint = new THREE.Vector3();
var zPlane = 250;
var goal = new THREE.Vector3();
var openingDistance = 50;

var isLiked = false;

// tweens
var wallTween, bodyTween;
var wallScaleX = 10;
var wallScaleY = 12;
var wallScaleZ = 10;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX = 0; 
var mouseY = 0;
var scaler = 2.5;
var circSegs = 32;
var mouthMaterial;
var headSize, eyeSize, pupilSize, eyeGap;

var bodyYEnd = -150;
var bodyYStart = bodyYEnd - 300;

var headPositionZ;
var headPositionZLiked = 550;
var bodyPositionZ = -360;

// an array to store our particles in
var particles = [];

// sound
var mySound;
var crazyMusic;
var boom;

// Init
function init() {
 
  // Mute button
  var $muteButton = $('#mute-button');

  $muteButton.on("click", function() {

    $muteButton.toggleClass('muted');

    if ($muteButton.hasClass('muted')) {
      buzz.all().mute();
    } else {
      buzz.all().unmute();
    }

  });

  if (!Modernizr.touch){
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

    // Sound!!!
    mySound = new buzz.sound( "/library/Sound/clickBeat", {
      formats: [ "ogg", "mp3", "aac" ]
    });

    mySound.play()
      .fadeIn()
      .loop()
    ;

    crazyMusic = new buzz.sound( "/library/Sound/crazy_loop", {
      formats: [ "ogg", "mp3", "aac" ]
    });

  }


  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // Camera and Scene
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 15000 );
  camera.position.z = 500;
  scene = new THREE.Scene();

  //Lights
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL( 1, 1, 1);
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  // var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  // scene.add( light );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8);
  directionalLight.position.set( 1, 1, 1.5 );
  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = 0.1;
  scene.add( directionalLight );
  
  var directionalLight2 = new THREE.DirectionalLight( 0xffef41, 0.3 );
  directionalLight2.position.set( 1, 1, 0 );
  directionalLight2.castShadow = true;
  directionalLight2.shadowDarkness = 0.1;
  scene.add( directionalLight2 );
  
  // Materials
  mouthMaterial = new THREE.MeshLambertMaterial( { color: 0Xfa76d9, shading: THREE.SmoothShading, overdraw: 1} );
  eyeMaterial = new THREE.MeshLambertMaterial( { color: 0Xfbfeeb, shading: THREE.SmoothShading, overdraw: 1} );
  skinMaterial = new THREE.MeshLambertMaterial( { color: 0X57bef8, shading: THREE.SmoothShading, overdraw: 1} );
  wallMaterial = new THREE.MeshPhongMaterial( { color: 0xaae800, specular: 0xffffff, shininess: 0, shading: THREE.FlatShading });
  hair2Material = new THREE.MeshPhongMaterial( { color: 0x1e1120, specular: 0x1e1120, shininess: 2, shading: THREE.FlatShading });
  hairMaterial = new THREE.MeshLambertMaterial( { color: 0X130B14, shading: THREE.SmoothShading, overdraw: 1} );
  innerMouthMaterial = new THREE.MeshLambertMaterial( { color: 0X000000, overdraw: 0.5 } );
  thumbMaterial = new THREE.MeshPhongMaterial( { color: 0x2E5FFF, specular: 0x2E5FFF, shininess: 0, shading: THREE.FlatShading });
  boxMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x000000, shininess: 0, shading: THREE.FlatShading });


  // Modelling


  // load thumb mesh

  var thumbLoader = new THREE.OBJLoader();
  
  thumbLoader.load(
    // resource URL
    '/library/3D/thumb.obj',
    // Function when resource is loaded
    function ( object ) {
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material = thumbMaterial;
          thumbMesh = new THREE.Mesh( child.geometry, child.material );
          //makeParticles(); 
        }
      } );
     
    }
  );

  // // Head and eyes

  headSize = 30;
  eyeSize = 6.5;
  pupilSize = eyeSize/4;
  eyeGap = 10;

  var headGeometry = new  THREE.SphereGeometry( headSize * scaler, circSegs, circSegs );
  var eyeGeometry = new  THREE.SphereGeometry( eyeSize * scaler, circSegs, circSegs );
  var pupilGeometry = new  THREE.TorusGeometry(  pupilSize * scaler, pupilSize*1.5, circSegs, circSegs );
  var boxGeometry = new THREE.BoxGeometry( headSize * scaler * 8, headSize * scaler *8, headSize * scaler *1 );
  var followGeometry = new  THREE.SphereGeometry( 0.1 * scaler, circSegs, circSegs );
  var handGeometry = new  THREE.SphereGeometry( 10 * scaler, circSegs, circSegs );

  var material = new THREE.MeshNormalMaterial();
  var pupilMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );

  var box = new THREE.Mesh( boxGeometry, boxMaterial );
  box.position.x = 0;
  box.position.z = -headSize*20;
  box.position.y = bodyYStart + (headSize*10);
  box.receiveShadow = false;
  box.visible = false;
  scene.add( box );


  var bodyGeometry = new THREE.CylinderGeometry(headSize*2.52, headSize*3, headSize*9, circSegs, circSegs, false);
  body = new THREE.Mesh( bodyGeometry, skinMaterial );
  body.position.x = 0;
  body.position.z = bodyPositionZ;
  body.position.y = bodyYStart;
  body.receiveShadow = true;
  body.visible = false;
  scene.add( body );

  head = new THREE.Mesh( headGeometry, skinMaterial );
  head.position.x = 0;
  head.position.z = headSize*2;
  headPositionZ = head.position.z;
  head.position.y = 130;
  head.castShadow = true;
  head.receiveShadow = true;
  body.add( head );

  hair = new THREE.Mesh( eyeGeometry, hairMaterial );
  hair.position.x = 0;
  hair.position.z = zPlane;
  hair.position.y = -(headSize*1.5) * scaler;
  hair.castShadow = true;
  hair.receiveShadow = true;
  //scene.add( hair );

  lEye = new THREE.Mesh( eyeGeometry, eyeMaterial );
  lEye.position.z = headSize * scaler;
  lEye.position.x = eyeGap * scaler;
  lEye.castShadow = true;
  lEye.receiveShadow = true;
  head.add( lEye );

   
  LidGeometry = new THREE.SphereGeometry( (eyeSize*1.2) * scaler,circSegs,circSegs, Math.PI/2, Math.PI, 0, Math.PI)
  lLidTop = new THREE.Mesh( LidGeometry, skinMaterial );
  lLidTop.rotation.z = 90 * (Math.PI/180);
  lLidTop.rotation.x = -90 * (Math.PI/180);
  lEye.add( lLidTop );
  lLidTop.visible = false;


  rEye = new THREE.Mesh( eyeGeometry, eyeMaterial );
  rEye.position.z = headSize * scaler;
  rEye.position.x = -eyeGap * scaler; 
  rEye.castShadow = true;
  rEye.receiveShadow = true;
  head.add( rEye );

  lPupil = new THREE.Mesh( pupilGeometry, pupilMaterial );
  lPupil.position.z = eyeSize * scaler;
  lPupil.position.x = 0 * scaler;
  lEye.add( lPupil );

  rPupil = new THREE.Mesh( pupilGeometry, pupilMaterial );
  rPupil.position.z = eyeSize * scaler;
  rPupil.position.x = 0 * scaler;
  rEye.add( rPupil );

  var points = [20,30,40,60,20];
  

  // ears  
  var earWidth = 65 * scaler;
  var earHeight =5 * scaler;
  var ear0pen = 1 * scaler;
  var earSmile = -2 * scaler;

  //Create ear Bend
  earCurve = new THREE.ClosedSplineCurve3( [
    new THREE.Vector3( 0, 0 + ear0pen, 0 ),
    new THREE.Vector3( earWidth/4, 0  + (ear0pen/1.4) + (earSmile/4), 0 ),  
    new THREE.Vector3( earWidth/2, 0 + earSmile, 0 ),
    new THREE.Vector3( earWidth/2, earHeight/2 + earSmile, 0 ),
    new THREE.Vector3( 0, earHeight/2 - (ear0pen/2) , 0 ),
    new THREE.Vector3( -earWidth/2, earHeight/2  + earSmile, 0 ),
    new THREE.Vector3( -earWidth/2, 0  + earSmile, 0 ),
    new THREE.Vector3( -earWidth/4, 0  + (ear0pen/1.4) + (earSmile/4), 0 )      
  ] );

  var earGeometry = new THREE.TubeGeometry(
      earCurve,  //path
      300,    //segme2
      2.5*scaler,     //radius
      5,     //radiusSegments
      true  //closed
  )

  ears = new THREE.Mesh( earGeometry, mouthMaterial );
    
  ears.position.z = -( headSize / 2) * scaler;
  ears.position.x = 0 * scaler; 
  ears.position.y = -5 * scaler;
  head.add( ears );

  // hair
    // instantiate a loader
  var loader2 = new THREE.OBJLoader();
  
  // load a resource
  loader2.load(
    // resource URL
    '/library/3D/hair.obj',
    // Function when resource is loaded
    function ( object ) {
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material = hair2Material;
        }
      } );
      head.add( object );

      object.rotation.y = -60 * (Math.PI/180);
      object.rotation.x = -50 * (Math.PI/180);
      object.rotation.z = -5 * (Math.PI/180);
      object.position.y = headSize*1.8;
      object.position.z = 0;
      object.castShadow = true;
      object.receiveShadow = true;
      object.scale.set(0.9,0.9,0.9);
    }
  );

  bodyTween =  new TWEEN.Tween( body.position ).to( { y: bodyYEnd }, 1000 )
      .easing( TWEEN.Easing.Elastic.Out).delay(100);

  // instantiate a loader
  var loader = new THREE.OBJLoader();
  
  // load a resource
  loader.load(
    // resource URL
    '/library/3D/hole.obj',
    // Function when resource is loaded
    function ( object ) {
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material = wallMaterial;
          $( "#cover" ).delay(100).fadeOut( 500 );
        }
      } );

      object.scale.set(wallScaleX,wallScaleY,wallScaleZ);


      scene.add( object );
      box.visible = true;

      wallTween = new TWEEN.Tween( object.scale ).to( { x: wallScaleX, y: wallScaleY, z: wallScaleZ }, 100 )
      .easing( TWEEN.Easing.Cubic.Out).delay(1000);


      wallTween.chain(bodyTween);
      wallTween.start();

      object.rotation.y = 90 * (Math.PI/180);
      object.rotation.x = -45 * (Math.PI/180);
      object.receiveShadow = true;
      object.position.y = -headSize*3;
      object.position.z = -headSize*10;
      body.visible = true;


    }
  );


  // Particles

  particleGeometry = new  THREE.SphereGeometry( 3, circSegs, circSegs );
  particleMaterial = new THREE.MeshLambertMaterial( { color: 0Xfa76d9, shading: THREE.SmoothShading, overdraw: 1} );


  // Rendering
  var amount = 1, object, parent = head;
  renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0Xebff71 );
  renderer.shadowMapEnabled = true;
  document.body.appendChild( renderer.domElement );
  //renderer.gammaInput = true;
  renderer.gammaOutput = true;


  goal = hair.position;

  window.addEventListener( 'resize', onWindowResize, false );

  distanceFromGoal = distanceMax;
  calculateFollowPoint(mouseX, mouseY);




}

// Blink
function blink(){

  lLidTop.visible = true;
  //lLidBottom.visible = true;

  var lidTo = 90 * (Math.PI/180);
  var lidFrom = -90 * (Math.PI/180);

  var blinkTween1 = new TWEEN.Tween( lLidTop.rotation ).to( { x: lidTo }, 20 ).easing( TWEEN.Easing.Cubic.Out);
  var blinkTween2 = new TWEEN.Tween( lLidTop.rotation ).to( { x: lidFrom }, 200 ).delay(10).easing( TWEEN.Easing.Cubic.In).onComplete(hideEyes);

  blinkTween1.chain(blinkTween2);

  blinkTween1.start();


}

function hideEyes(){

  lLidTop.visible = false;

}

// creates a random field of Particle objects

function makeParticles() { 
  
  var particle, material; 

  // we're gonna move from z position -1000 (far away) 
  // to 1000 (where the camera is) and add a random particle at every pos. 
  for ( var zpos= -1000; zpos < 1000; zpos+=20 ) {

    // we make a particle material and pass through the 
    // colour and custom particle render function we defined. 


    particle = new THREE.Mesh( particleGeometry, particleMaterial );
    particle = thumbMesh.clone();

    // give it a random x and y position between -500 and 500
    particle.position.x = Math.random() * 1000 - 500;
    particle.position.y = Math.random() * 1000 - 500;

    var blankSpot = 400;
    while(particle.position.x >= -200 && particle.position.x <= 200 && particle.position.y >= -200 && particle.position.y <= 200){
      particle.position.x = Math.random() * 1000 - 500;
      particle.position.y = Math.random() * 1000 - 500;
    }
   


    // set its z position
    particle.position.z = zpos;

    // scale it up a bit
    particle.scale.x = particle.scale.y = particle.scale.z = 0.5;

    // add it to the scene
    scene.add( particle );

    // and to the array of particles. 
    particles.push(particle); 
  }
  
}




// moves all the particles dependent on mouse position

function updateParticles() { 
  
  var speed = 1000;
  // iterate through every particle
  for(var i=0; i<particles.length; i++) {

    particle = particles[i]; 

    // and move it forward dependent on the mouseY position. 
    particle.position.z +=  speed * 0.1;

    // if the particle is too close move it to the back
    if(particle.position.z>1000) particle.position.z-=2000; 

  }

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
function onDocumentMouseDown(event){

    onDocumentMouseMove(event);
}

function onDocumentMouseMove(event) {
  mouseOut = false;

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

  calculateFollowPoint(event.clientX , event.clientY);

  
}

function onDocumentTouchMove(event) {
  mouseOut = false;

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

  calculateFollowPoint(event.clientX , event.clientY);

  
}

function onDocumentMouseOut(event) {
  mouseOut = true;
}

function calculateFollowPoint(xPos, yPos){
  // Work out and save Follow point 
  var vector = new THREE.Vector3();

  vector.set( ( xPos / window.innerWidth ) * 2 - 1, - ( yPos / window.innerHeight ) * 2 + 1, 0.5 );
  
  vector.unproject( camera );
  
  var dir = vector.sub( camera.position ).normalize();
  
  var distance = - ((camera.position.z / dir.z) + zPlane ) ;
  
  followPoint = camera.position.clone().add( dir.multiplyScalar( distance ) );

  distanceFromGoal = followPoint.distanceTo(goal);



  if(isLiked == false){

    if(distanceFromGoal >= distanceMax){
      distanceFromGoal = distanceMax;
    }

    if(distanceFromGoal > 60){
      offScreen = true;
    }else{
      offScreen = false;
    }
  }else{
    distanceFromGoal = 0;
  } 
}

function animate() {

  // Body jig
  //var bob = M

  head.remove(mouth);
  head.remove(brow);
  head.remove(innerMouth);
  if(mouthGeometry){
    mouthGeometry.dispose();
  }
  if(browGeometry){
    browGeometry.dispose();
  }
  if(innerMouthGeometry){
    innerMouthGeometry.dispose();
  }

  // Mouth animation 

  var mWidth = 50 * scaler;
  var mHeight = 9 * scaler;
  var open = -17 * scaler + (distanceFromGoal/2);
  var smile = 5 * scaler + 20 - (distanceFromGoal/2.2);

  if(isLiked == true){
    var mWidth = 50 * scaler;
    var mHeight = 9 * scaler;
    var open = -17 * scaler + (distanceFromGoal/2);
    var smile = 5 * scaler + 20 - (distanceFromGoal/2.2);

  }
  updateParticles();

  var roundness = 5;

  //Create Bend
  curve = new THREE.ClosedSplineCurve3( [
    new THREE.Vector3( 0, 0 + open, 0 ),                      // mid bottom
    new THREE.Vector3( mWidth/4, 0  + (open/1.4) + (smile/roundness), 0 ),      // rounder bottom right
    new THREE.Vector3( mWidth/2, 0 + smile, 0 ),                  // bottom right corner
    new THREE.Vector3( mWidth/2, mHeight/2 + smile, 0 ),              // top right corner
    new THREE.Vector3( mWidth/4, mHeight/2 + (smile/roundness), 0 ),        //+ rounder top right
    new THREE.Vector3( 0, mHeight/2, 0 ),               // top Middle
    new THREE.Vector3( -mWidth/4, mHeight/2 + (smile/roundness), 0 ),       //+ rounder top left
    new THREE.Vector3( -mWidth/2, mHeight/2  + smile, 0 ),              // topleft corner
    new THREE.Vector3( -mWidth/2, 0  + smile, 0 ),                  // bottom left corner
    new THREE.Vector3( -mWidth/4, 0  + (open/1.4) + (smile/roundness), 0 )      // rounder bottom left    
  ] );

  mouthGeometry = new THREE.TubeGeometry(
      curve,  //path
      100,    //segme2
      2.5*scaler,     //radius
      8,     //radiusSegments
      true  //closed
  )


  mouth = new THREE.Mesh( mouthGeometry, mouthMaterial );
    
  mouth.position.z = (headSize) * scaler;
  mouth.position.x = 0 * scaler; 
  mouth.position.y = (-headSize/2) * scaler;
  mouth.castShadow = true;
  mouth.receiveShadow = true;
  head.add( mouth );
         
  innerMouthShape = new THREE.Shape( curve.getSpacedPoints(100) );
  innerMouthGeometry = new THREE.ShapeGeometry( innerMouthShape );

  innerMouth = new THREE.Mesh( innerMouthGeometry, innerMouthMaterial );
  innerMouth.position.z = (headSize) * scaler;
  innerMouth.position.x = 0 * scaler; 
  innerMouth.position.y = (-headSize/2) * scaler;
  head.add( innerMouth );


  // brow animation 

  var browWidth = (headSize) * scaler;
  var browSmile = 3 * scaler + 10 - (distanceFromGoal/3);
  var browRoundness = 1.3;

  //Create Bend
  browCurve = new THREE.SplineCurve3( [
    new THREE.Vector3( -browWidth/2 - (headSize/5), 0, - (headSize/2) ),
    new THREE.Vector3( -browWidth/2, 0, 0 ),                // bottom left corner
    new THREE.Vector3( -browWidth/4, 0 + (browSmile/browRoundness), 0 ),        // rounder bottom left  
    new THREE.Vector3( 0, 0 + browSmile, 0 ),                         // mid bottom
    new THREE.Vector3( browWidth/4, 0 + (browSmile/browRoundness), 0 ),       // rounder bottom right
    new THREE.Vector3( browWidth/2, 0, 0 ),
    new THREE.Vector3( browWidth/2 + (headSize/5), 0,  - (headSize/2)  )                // bottom right corner
  ] );

  browGeometry = new THREE.TubeGeometry(
      browCurve,  //path
      100,    //segme2
      2.5*scaler,     //radius
      8,     //radiusSegments
      false  //closed
  )


  brow = new THREE.Mesh( browGeometry, hairMaterial );
    
  brow.position.z = (headSize/1.05) * scaler;
  brow.position.x = 0 * scaler; 
  brow.position.y = (headSize/3) * scaler;
  brow.castShadow = true;
  brow.receiveShadow = true;
  head.add( brow );




  requestAnimationFrame( animate );
  render();
  //stats.update();
}

function render() {

  TWEEN.update();

  //console.log("working");

  var time = Date.now() * 0.001;
  //head.lookAt(followPoint);
    // clear the scene

  if(isLiked == false && mouseOut == false){
    lEye.lookAt(followPoint);
    rEye.lookAt(followPoint);
    head.rotation.x = (mouseY/10000);
    head.rotation.z = -(mouseX/10000);
    head.rotation.y = (mouseX/10000);
    body.rotation.x = 0;
    body.rotation.z = -(mouseX/10000);
    body.rotation.y = (mouseX/10000);
  
  }else if(isLiked == false && mouseOut == true){
    lEye.lookAt(camera.position);
    rEye.lookAt(camera.position);
    
    if (offScreen==false){

      var bob = Math.sin(time*20)*0.02;
      head.rotation.x = bob;
    }else{
      lEye.lookAt(goal);
      rEye.lookAt(goal);
    }
   
  }else{
    lEye.lookAt(camera.position);
    rEye.lookAt(camera.position);
    lEye.rotation.x += 0.4;
    rEye.rotation.x -= 0.4;
    head.rotation.x = 0;
    head.rotation.z = 0;
    head.rotation.y = 0;
    body.rotation.x = 0;
    body.rotation.z = 0;
    body.rotation.y = 0;
    var bob = Math.sin(time*120)*0.3;
    //lEye.scale.x += bob/6;
    //rEye.scale.y += bob/6;
    body.position.y = bodyYEnd + bob*4;
    body.rotation.y = (bob/1000);

    var bob2 = Math.sin(time*14.8)*10;
    var bob3 = Math.sin(time*7.5)*10;

    body.position.z = bodyPositionZ + bob2*4;   
    //body.rotation.z = bob3 / 100;   

  }

  camera.lookAt( mouth.position );

  renderer.render( scene, camera );

}

function resize() { 
  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;     
}

function liked(){

  // ANALYTICS
  ga('send', 'event', 'Social Event', 'liked');

  document.removeEventListener( 'mousemove', onDocumentMouseMove);

  calculateFollowPoint(windowHalfX , windowHalfY*1.60);


  makeParticles(); 


  if(isLiked == false){
    new TWEEN.Tween( head.position ).to( {
      x: head.position.x,
      y: head.position.y + 10,
      z: headPositionZ + headPositionZLiked}, 1000 )
      .easing( TWEEN.Easing.Elastic.Out).start();

    mySound.setSpeed(4);
    mySound.setVolume(90);
  }

  crazyMusic.play()
    .loop()
    .fadeOut()
  ;

  mySound.stop()

  $("#fb").hide();
  $("#title").hide();


  isLiked = true;
  console.log("liked!!!");

  // Start 5 delay before fading to final screen
  // add event to kill canvas and show call to action
  $( "canvas" ).delay( 4000 ).fadeOut( 1500 , function() {
    $( "canvas" ).remove();  
  });
  $('#mute-button').delay( 5000 ).fadeOut( 500 );
  $("#callToAction").delay( 5500 ).fadeIn( 500 );
  $("#twitter").delay( 5500 ).fadeIn( 500 );
}

function unliked(){

  // ANALYTICS
  ga('send', 'event', 'Social Event', 'unliked');

}






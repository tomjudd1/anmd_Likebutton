var container, stats;
var camera, scene, renderer, composer;
var geometry, head, mouth, curve, browCurve, body, brow, mouthGeometry, browGeometry, wall, wallGeometry, hole;
var mouseX = 0, mouseY = 0;

var distanceFromGoal = 0;
var followPoint = new THREE.Vector3();
var zPlane = 250;
var goal = new THREE.Vector3();
var openingDistance = 50;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var scaler = 2.5;
var circSegs = 32;
var mouthMaterial;
var headSize, eyeSize, pupilSize, eyeGap;
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function init() {

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

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( 1, 1, 1.5 );
  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = 0.1;
  scene.add( directionalLight );
  
  var directionalLight2 = new THREE.DirectionalLight( 0xffef41, 0.5 );
  directionalLight2.position.set( 1, 1, 0 );
  directionalLight2.castShadow = true;
  directionalLight2.shadowDarkness = 0.1;
  scene.add( directionalLight2 );
  
  // Materials
  mouthMaterial = new THREE.MeshLambertMaterial( { color: 0Xfa76d9, shading: THREE.SmoothShading, overdraw: 1} );
  eyeMaterial = new THREE.MeshLambertMaterial( { color: 0Xfbfeeb, shading: THREE.SmoothShading, overdraw: 1} );
  skinMaterial = new THREE.MeshLambertMaterial( { color: 0X57bef8, shading: THREE.SmoothShading, overdraw: 1} );
  wallMaterial = new THREE.MeshPhongMaterial( { color: 0xaae800, specular: 0xffffff, shininess: 0, shading: THREE.FlatShading });
  hairMaterial = new THREE.MeshLambertMaterial( { color: 0X1e1120, shading: THREE.SmoothShading, overdraw: 1} );

  // Modelling

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
        }
      } );
      scene.add( object );
      object.rotation.y = 90 * (Math.PI/180);
      object.rotation.x = -20 * (Math.PI/180);
      object.receiveShadow = true;
      object.position.y = -headSize*3;
      object.position.z = -headSize*10;
      object.scale.set(10,10,10);
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
  
  var followGeometry = new  THREE.SphereGeometry( 0.1 * scaler, circSegs, circSegs );
  var handGeometry = new  THREE.SphereGeometry( 10 * scaler, circSegs, circSegs );

  var material = new THREE.MeshNormalMaterial();
  var pupilMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );


  var bodyGeometry = new THREE.CylinderGeometry(headSize*2.52, headSize*3, headSize*8, circSegs, circSegs, false);
  body = new THREE.Mesh( bodyGeometry, skinMaterial );
  body.position.x = 0;
  body.position.z = -400;
  body.position.y = -150;
  body.receiveShadow = true;
  scene.add( body );

  head = new THREE.Mesh( headGeometry, skinMaterial );
  head.position.x = 0;
  head.position.z = headSize*2;
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

  // Rendering
  var amount = 1, object, parent = head;
  renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0X130a17 );
  renderer.shadowMapEnabled = true;
  document.body.appendChild( renderer.domElement );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // Stats
  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // stats.domElement.style.zIndex = 100;
  // container.appendChild( stats.domElement );

  goal = hair.position;

  window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

  // Work out and save Follow point 
  var vector = new THREE.Vector3();

  vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
  
  vector.unproject( camera );
  
  var dir = vector.sub( camera.position ).normalize();
  
  var distance = - ((camera.position.z / dir.z) + zPlane ) ;
  
  followPoint = camera.position.clone().add( dir.multiplyScalar( distance ) );

  distanceFromGoal = followPoint.distanceTo(goal);

}

function animate() {

  // clear the scene
  
  head.remove(mouth);
  head.remove(brow);
  if(mouthGeometry){
    mouthGeometry.dispose();
  }
  if(browGeometry){
    browGeometry.dispose();
  }
  

  // Mouth animation 

  var mWidth = 50 * scaler;
  var mHeight = 9 * scaler;
  var open = -3 * scaler + (distanceFromGoal/20);
  var smile = 3 * scaler + 20 - (distanceFromGoal/6);

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


  // brow animation 

  var browWidth = (headSize) * scaler;
  var browSmile = 3 * scaler + 10 - (distanceFromGoal/8);
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


  brow = new THREE.Mesh( browGeometry, mouthMaterial );
    
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

  //console.log("working");

  var time = Date.now() * 0.001;
  //head.lookAt(followPoint);
  lEye.lookAt(followPoint);
  rEye.lookAt(followPoint);
  camera.lookAt( mouth.position );

  head.rotation.x = (mouseY/10000);
  head.rotation.z = -(mouseX/10000);
  head.rotation.y = (mouseX/10000);
  body.rotation.x = 0;
  body.rotation.z = -(mouseX/10000);
  body.rotation.y = (mouseX/10000);
  
  renderer.render( scene, camera );

}

function resize() { 
  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;     
}

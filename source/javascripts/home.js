//= require "modernizr/modernizr.js"
//= require "jquery"
//= require "jquery.transit"
//= require "EaselJS"
//= require "SoundJS"
//= require "TweenJS"
//= require "PreloadJS"
//= require "threejs"
//= require "threejs/examples/js/loaders/OBJLoader"
//= require "3D"

// -------------------------------------------------
//
// Home
// 
// -------------------------------------------------

(function() {

  "use strict";

  var Piece = function() {

    var self = this;

    self.init();

  };

  Piece.prototype = {

    // -------------------------------------------------
    //
    // Initial scene setup
    // 
    // -------------------------------------------------

    init: function() {

      var self = this;
      
      // run 3d man code
      console.log('Welcom to 3D like button');

    }

  };

  new Piece();

})();
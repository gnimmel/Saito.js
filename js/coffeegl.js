
/*                    __  .__              ________ 
   ______ ____   _____/  |_|__| ____   ____/   __   \
  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
 /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
      \/     \/     \/                    \/         
 
THE GHOST IN THE CSH
 
CoffeeGL JS v0.1

Benjamin Blundell

oni@section9.co.uk

http://www.section9.co.uk

Based on the excellent work from:

* Learning WebGL - http://learningwebgl.com/
* JQuery and JQueryUI - http://jquery.com/
* Sylvester Maths Library - http://sylvester.jcoglan.com/

This software is released under Creative Commons Attribution Non-Commercial Share Alike
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

(function() {
  var CGL, CoffeeGL, _setupFrame,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CoffeeGL = (function() {

    CoffeeGL.totalTime = 0.0;

    CoffeeGL.loops = 0;

    CoffeeGL.skipTicks = 0;

    CoffeeGL.fps = 30;

    CoffeeGL.fullscreen = true;

    CoffeeGL.debug = false;

    CoffeeGL.skipTicks = 1000 / CoffeeGL.fps;

    CoffeeGL.maxFrameSkip = 10;

    CoffeeGL.nextGameTick = (new Date).getTime();

    CoffeeGL.prototype.startTime = 0;

    CoffeeGL.prototype.oldTime = 0;

    CoffeeGL.prototype.width = 0;

    CoffeeGL.prototype.height = 0;

    function CoffeeGL() {
      this.resize = __bind(this.resize, this);
      this.getDelta = __bind(this.getDelta, this);
      this.run = __bind(this.run, this);      this.startTime = Date.now();
      this.oldTime = startTime;
    }

    CoffeeGL.prototype.run = function() {
      if (this.debug) console.log("running");
      return this.resize();
    };

    CoffeeGL.prototype.getDelta = function() {
      var deltaTime;
      deltaTime = Date.now() - this.oldTime;
      this.oldTime = Date.now();
      return deltaTime;
    };

    CoffeeGL.prototype.resize = function() {
      if (this.canvas) {
        if (this.height !== this.canvas.height || this.width !== this.canvas.width) {
          this.height = this.canvas.height;
          this.width = this.canvas.width;
          this.gl.viewportWidth = this.width;
          return this.gl.viewportHeight = this.height;
        }
      }
    };

    return CoffeeGL;

  })();

  _setupFrame = function() {
    var onEachFrame;
    if (window.webkitRequestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb;
        _cb = function() {
          cb();
          return webkitRequestAnimationFrame(_cb);
        };
        return _cb();
      };
    } else if (window.mozRequestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb;
        _cb = function() {
          cb();
          return mozRequestAnimationFrame(_cb);
        };
        return _cb();
      };
    } else {
      onEachFrame = function(cb) {
        return setInterval(cb, 1000 / 60);
      };
    }
    return window.onEachFrame = onEachFrame;
  };

  _setupFrame();

  CGL = new CoffeeGL();

  CGL.canvas = document.getElementById("webgl-canvas");

  if (CoffeeGL.debug) {
    CGL.gl = WebGLDebugUtils.makeDebugContext(CGL.canvas.getContext("experimental-webgl"));
  } else {
    CGL.gl = CGL.canvas.getContext("experimental-webgl");
  }

  window.onEachFrame(CGL.run);

}).call(this);

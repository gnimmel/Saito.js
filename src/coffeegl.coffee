###                    __  .__              ________ 
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

 ###


# Master CoffeeGL Code Class

class CoffeeGL
   
  @totalTime: 0.0
  @loops: 0
  @skipTicks: 0
  @fps: 30
  @fullscreen: true
  @debug: false
  @skipTicks: 1000 / @fps
  @maxFrameSkip: 10
  @nextGameTick: (new Date).getTime()
  startTime: 0
  oldTime: 0
  width: 0
  height: 0

  constructor: () ->
    @startTime = Date.now()
    @oldTime = @startTime

  run : () =>
    if @debug
      console.log "running"
    @resize()

  getDelta : () =>
    deltaTime = Date.now() - @oldTime
    @oldTime = Date.now()
    return deltaTime

  resize: () =>
    if @canvas
      if @height != @canvas.height or @width != @canvas.width
        @height = @canvas.height
        @width = @canvas.width
        @gl.viewportWidth = @width
        @gl.viewportHeight = @height




# OnEachFrame function
# Taken from http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html

_setupFrame = () -> 

  if window.webkitRequestAnimationFrame
    onEachFrame = (cb)-> 
      _cb = () ->
        cb()
        webkitRequestAnimationFrame _cb
      _cb()
  
  else if window.mozRequestAnimationFrame 
    onEachFrame = (cb) ->
      _cb = () ->
        cb() 
        mozRequestAnimationFrame _cb
      _cb()
  else
    onEachFrame = (cb) ->
      setInterval cb, 1000 / 60

  window.onEachFrame = onEachFrame

_setupFrame()

# Override and have a function that takes a canvas so we can have multiple
CGL = new CoffeeGL()
CGL.canvas = document.getElementById "webgl-canvas"

if CoffeeGL.debug 
  CGL.gl = WebGLDebugUtils.makeDebugContext CGL.canvas.getContext "experimental-webgl"  
else
  CGL.gl = CGL.canvas.getContext("experimental-webgl");
        

window.onEachFrame CGL.run



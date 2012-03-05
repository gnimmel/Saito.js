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

This software is released under Creative Commons Attribution Non-Commercial Share Alike
http://creativecommons.org/licenses/by-nc-sa/3.0/

- Resources

* http://www.yuiblog.com/blog/2007/06/12/module-pattern/
* 

###

namespace = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top

namespace "CoffeeGL", (exports) ->

  # Exported current context - current latest app 

  exports.context

  # Master CoffeeGL Code Class

  class exports.App

    constructor: (element,@debug=false) ->
      @totalTime = 0.0
      @loops = 0
      @skipTicks = 0
      @fps = 30
      @fullscreen = true
      @skipTicks = 1000 / @fps
      @maxFrameSkip = 10
      @nextGameTick = (new Date).getTime()
      @width = 0
      @height = 0
      @resources = 0
      @startTime = Date.now()
      @oldTime = @startTime
      @canvas = document.getElementById element

      @modelViewMatrix = []
      @perspectiveMatrix = []

      @modelViewMatrix.push(new exports.Matrix4())
      @perspectiveMatrix.push(new exports.Matrix4())

      # todo - webgl debug utils
      if @debug
        @gl = WebGLDebugUtils.makeDebugContext @canvas.getContext "experimental-webgl"
        console.log "CoffeeGL - creating OpenGL debug context"
      else
        @gl = @canvas.getContext "experimental-webgl"
        
      exports.context = this
      window.onEachFrame @run

    run : () =>
      @resize()
      if @resources == 0
        @draw()

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

    draw: () ->
      0 

    # push the current modelview matrix - perspective is less used tbh
    pushMatrix: ()->
      m = modelViewMatrix[modelViewMatrix.length-1].dup()
      modelViewMatrix.push(m)

    popMatrix: () ->
      modelViewMatrix.pop()

    # translate takes a 3 dimensional vector
    translate: (v) ->
      m = modelViewMatrix[modelViewMatrix.length-1]
      m.a[12] += v.x
      m.a[13] += v.y
      m.a[14] += v.z
      m


    # rotation in degrees around a unit vector
    rotate: (a, v) ->

      a = exports.degToRad(a)

      m = modelViewMatrix[modelViewMatrix.length-1]
      r = new Matrix4()
      r.a[0] = Math.cos(a) + (v.x * v.x) * (1 - Math.cos(a))
      r.a[1] = (v.y * v.x) * (1 - Math.cos(a)) + v.z * Math.sin(a)
      r.a[2] = (v.z * v.x) * (1 - Math.cos(a)) - v.y * Math.sin(a)

      r.a[4] = (v.x * v.y) * (1 - Math.cos(a)) - v.z * Math.sin(a)
      r.a[5] = Math.cos(a) + (v.y * v.y) * (1 - Math.cos(a))
      r.a[6] = (v.z * v.y) * (1 - Math.cos(a)) - v.x * Math.sin(a)

      r.a[8] = (v.z * v.x) * (1 - Math.cos(a)) - v.y * Math.sin(a)
      r.a[9] = (v.z * v.y) * (1 - Math.cos(a)) + v.x * Math.sin(a)
      r.a[10] = Math.cos(a) + (v.z * v.z) * (1 - Math.cos(a))

      m.toMultiply(r)

    # scale takes a 3 dimensional vector - doesn't affect w
    scale: (v)->
      m = modelViewMatrix[modelViewMatrix.length-1]
      m.a[0] *= v.x
      m.a[5] *= v.y
      m.a[10] *= v.z
      m

# OnEachFrame function
# Taken from http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
# Need a method to attach this to all instances of coffeescript

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

# export CoffeeGL as a global function when this is compiled
window.CoffeeGL = CoffeeGL
_setupFrame()




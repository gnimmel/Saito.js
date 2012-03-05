#                       __  .__              ________ 
#   _____  ____   _____/  |_|__| ____   ____/   __   \
#  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
#  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
# /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
#      \/     \/     \/                    \/         
# 
# THE GHOST IN THE CSH
# 
# CoffeeGL JS v0.1
#
# Benjamin Blundell
#
# oni@section9.co.uk
#
# http://www.section9.co.uk
#
# This software is released under Creative Commons Attribution Non-Commercial Share Alike
# http://creativecommons.org/licenses/by-nc-sa/3.0/


# Framebuffer objects - reads the current active context from the exports and creates a FBO

namespace "CoffeeGL", (exports) ->

  # Basic FBO with depth, linear filtering and RGBA with unsigned bytes

  class exports.fbo

    constructor: (@size) ->
      gl = exports.context.gl

      @framebuffer = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER,@framebuffer)
      @framebuffer.width = @size.x
      @framebuffer.height = @size.y
      @texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D,@texture)
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)

      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,@size.x,@size.y,0,gl.RGBA,gl.UNSIGNED_BYTE,null)

      @renderbuffer = gl.createRenderbuffer()
      gl.bindRenderbuffer(gl.RENDERBUFFER,@renderbuffer)

      gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,@framebuffer.width,@framebuffer.height)
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,@texture,0)
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,@renderbuffer)
      gl.bindTexture(gl.TEXTURE_2D,null)
      gl.bindRenderbuffer(gl.RENDERBUFFER,null)
      gl.bindFramebuffer(gl.FRAMEBUFFER,null)

      if gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE
        console.log "Failed to Create Framebuffer!"
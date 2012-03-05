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

# Shader Objects

namespace "CoffeeGL", (exports) ->

  # Basic FBO with depth, linear filtering and RGBA with unsigned bytes
  # given text variables - however they come, compile up a shader

  class exports.shader

    constructor: (@sv, @sf, @sg=null) ->
      gl = exports.context.gl
      # Create the Vertex Shader
      @vertexShader = gl.createShader(gl.VERTEX_SHADER);
      if @vertexShader
        gl.shaderSource(@vertexShader, @sv)
        gl.compileShader(@vertexShader)
        if not gl.getShaderParameter(@vertexShader,gl.COMPILE_STATUS)	
          console.log "CoffeeGL Error - Could not compile vertex shader"
      else
        console.log "CoffeeGL Error - No vertex shader object could be created"

      # Fragment Shader 
      
      @fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	 
      if @fragmentShader
        gl.shaderSource(@fragmentShader,@sf)
        gl.compileShader(@fragmentShader)
        if not gl.getShaderParameter(@fragmentShader,gl.COMPILE_STATUS)
          console.log "CoffeeGL Error - Could not compile fragment shader"
      else
        console.log "CoffeeGL Error - No Fragment shader object could be created"
      
      @shaderProgram = gl.createProgram()


      # todo - GEOMETRY SHADER

    bind: ->
      gl = exports.context.gl
      gl.attachShader(@shaderProgram, @vertexShader)
      gl.attachShader(@shaderProgram, @fragmentShader)
      gl.linkProgram(@shaderProgram)
      gl.useProgram(@shaderProgram);

    unbind: ->
      gl = exports.context.gl
      gl.detachShader(@shaderProgram, @vertexShader)
      gl.detachShader(@shaderProgram, @fragmentShader)
      gl.useProgram(null);

    setUniform3f: (name,a,b,c) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform3f(uniform,a,b,c)	

    setUniform3v: (name,v) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform3f(uniform,v.x,v.y,v.z)

    setUniform4f: (name,a,b,c,d) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform4f(uniform,a,b,c,d)	

    setUniform4v: (name,v) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform4f(uniform,v.x,v.y,v.z,v.w)	

    setUniform1f: (name,a) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform1f(uniform,a)

    setUniform1i: (name,a) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)
      gl.uniform1i(uniform,a)

    setMatrix4f: (name, m) ->
      gl = exports.context.gl
      uniform = gl.getUniformLocation(@shaderProgram, name)	
      gl.uniformMatrix4fv(uniform, false, new Float32Array(m.flatten()))


  # create a basic pass-through shader we can use

  class exports.shader.basic extends exports.shader
    constructor: () ->
  
      @sv = "attribute vec3 aVertexPosition;
attribute vec4 aVertexColour;
attribute vec3 aVertexNormal;
uniform mat4 uModelViewMatrix; 
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec4 vColor;
varying vec4 vTransformedNormal;

void main(void) {
	gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
	vColor = aVertexColour;
	vTransformedNormal =  uNormalMatrix * vec4(aVertexNormal, 1.0);
}
"
      @sf = "#ifdef GL_ES 
precision highp float; 
#endif

varying vec4 vColor;

void main(void) { gl_FragColor = vColor; }"
      
      super(@sv,@sf)


  # create a lighting shader thats fairly basic
  class exports.shader.lighting extends exports.shader

    constructor: () ->
      @sv = "attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec4 vTransformedNormal;
varying vec4 vPosition;


void main(void) {
    vPosition = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    gl_Position =  vPosition;
    vTextureCoord = aTextureCoord;
    vTransformedNormal = uModelViewMatrix * vec4(aVertexNormal, 1.0);
}
"

      @sf = "#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec4 vTransformedNormal;
varying vec4 vPosition;

uniform vec3 uMaterialAmbientColor;
uniform vec3 uMaterialDiffuseColor;
uniform vec3 uMaterialSpecularColor;
uniform float uMaterialShininess;
uniform vec3 uMaterialEmissiveColor;

uniform vec3 uAmbientLightingColor;

uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingDiffuseColor;
uniform vec3 uPointLightingSpecularColor;

uniform sampler2D uSampler;


void main(void) {
    vec3 ambientLightWeighting = uAmbientLightingColor;

    vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
    vec3 normal = normalize(vTransformedNormal.xyz);

    vec3 specularLightWeighting = vec3(0.0, 0.0, 0.0);
//    vec3 eyeDirection = normalize(-vPosition.xyz);
	vec3 eyeDirection = vec3(0,0,-1);

    vec3 reflectionDirection = reflect(-lightDirection, normal);

    float specularLightBrightness = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
    specularLightWeighting = uPointLightingSpecularColor * specularLightBrightness;

    float diffuseLightBrightness = max(dot(normal, lightDirection), 0.0);
    vec3 diffuseLightWeighting = uPointLightingDiffuseColor * diffuseLightBrightness;
    
    vec3 materialAmbientColor = uMaterialAmbientColor;
    vec3 materialDiffuseColor = uMaterialDiffuseColor;
    vec3 materialSpecularColor = uMaterialSpecularColor;
    vec3 materialEmissiveColor = uMaterialEmissiveColor;
    float alpha = 1.0;

    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    materialAmbientColor = materialAmbientColor * textureColor.rgb;
    materialDiffuseColor = materialDiffuseColor * textureColor.rgb;
    materialEmissiveColor = materialEmissiveColor * textureColor.rgb;
    alpha = textureColor.a;
 

    gl_FragColor = vec4(
      materialAmbientColor * ambientLightWeighting
      + materialDiffuseColor * diffuseLightWeighting
      + materialSpecularColor * specularLightWeighting
      + materialEmissiveColor,
      alpha
    );
}
"   





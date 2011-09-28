/*                     __  .__              ________ 
   ______ ____   _____/  |_|__| ____   ____/   __   \
  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
 /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
      \/     \/     \/                    \/         
 
THE GHOST IN THE CSH
 
SAITO.JS  v.3

Benjamin Blundell

oni@section9.co.uk

http://www.section9.co.uk

Based on the excellent work from:

* Learning WebGL - http://learningwebgl.com/
* JQuery and JQueryUI - http://jquery.com/
* Sylvester Maths Library - http://sylvester.jcoglan.com/
* Termlib - http://www.masswerk.at/termlib/

This software is released under Creative Commons Attribution Non-Commercial Share Alike
http://creativecommons.org/licenses/by-nc-sa/3.0/

 */

/**
 * \todo reindent and recomment
 * \todo fix the model loading
 * \todo handle the matrix funtions for setting up defaults
 * \todo lighting class that actually works with real gl lighting (and in the shader too) - if possible
 * \todo simple colour class
 */

/**
 * Globals
 */
var gl;

var DEBUG = false;
var USEJQUERYUI = true;
var FULLSCREEN = true;

// Debug mode does seem to have some side-effects!

/**
 * Master Saito Object
 */


var Saito = new Object();

// Possibly don't need to prototype but I'll leave it for now

Saito.prototype = {

	_setup : function() {
		Saito.setup();    
        	setInterval(Saito.prototype._tick, 15);
		Saito.totalTime = 0.0;

	},
    	
	_tick : function() {
	    
		var timeNow = new Date().getTime();
        	if (Saito.lastTime  != 0) {
			Saito.elapsed = timeNow - Saito.lastTime;
        	}
        	Saito.lastTime  = timeNow;
		Saito.totalTime += Saito.elapsed;
	
		Saito.prototype._update();
		Saito.prototype._draw();  
	},
	
	_update : function () {
		Saito.update();
	    
		// Technical these mouse elements may not exist yet
		Saito.mouseXprev = Saito.mouseX;
		Saito.mouseYprev = Saito.mouseY; 
	},
	
	_draw : function() {
		if (Saito.resources == 0) {
			Saito.draw();    
		}
	},

	_resize: function(width,height) {
		if (Saito.resize != undefined) { Saito.resize(width,height); }
		if (FULLSCREEN) {
			Saito.canvas.width = width;
			Saito.canvas.height = height;
		}
		gl.viewportWidth = Saito.canvas.width;
        	gl.viewportHeight = Saito.canvas.height;
	},

	getWidth : function () {
		return Saito.canvas.width;
	},

	getHeight : function () {
		return Saito.canvas.height;
	}

	
};

/**
 * Saito Member Variables 
 */

Saito.lastTime = 0;	
Saito.elapsed = 0;
Saito.resources = 0;

function throwOnGLError(err, funcName, args) {
	throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" + funcName;
};

/**
 * Saito Initialise Function
 */

Saito.initialize = function(){
	this.canvas = $("#webgl-canvas")[0];	    
	try {
        	if (DEBUG) gl = WebGLDebugUtils.makeDebugContext(this.canvas.getContext("experimental-webgl"));
        	else gl = this.canvas.getContext("experimental-webgl");
        
        	gl.viewportWidth = Saito.width = this.canvas.width;
        	gl.viewportHeight = Saito.height = this.canvas.height;
      
               	this.activeShader = "none";

  		// Add the mouse handler
        	setMouseHandler();

		/// OpenGL Constants \todo remove eventually
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
       		this.prototype._setup();		

    	} catch(e) {
        	alert(e);
    	}
    	
	if (!gl) {
        	alert("Could not initialise WebGL, sorry :-(");
    	}else if (FULLSCREEN){
		Saito.prototype._resize($(window).width(), $(window).height());
	}

};


var $S = Saito;

$(window).resize(function() {
	Saito.prototype._resize($(window).width(), $(window).height());
});


/**
 * The Shader Class. Given two filenames, create our shader
 */

SaitoShader = function(vertpath,fragpath) {

	/// Two sets of JSON Calls to load the required data

	$.ajaxSetup({'beforeSend': function(xhr){
    		if (xhr.overrideMimeType)
        		xhr.overrideMimeType("text/plain");
    		}
	});

	var object = this;

	// Load Vertex Shader
	Saito.resources++;
	$.ajax({
        	url: vertpath,
		success: function(vertdata){
			Saito.resources--;

			if (vertdata){
				if (DEBUG) alert("Loaded " + vertpath + "\n\n");
				Saito.resources++;
				
				
				$.ajaxSetup({'beforeSend': function(xhr){
    					if (xhr.overrideMimeType)
        					xhr.overrideMimeType("text/plain");
    					}
				});

				// Load Fragment Shader
				$.ajax({
        				url: fragpath,
					success: function(fragdata){
						Saito.resources--;
						if (fragdata){
							if (DEBUG) alert("Loaded " + fragpath + "\n\n");
							
							// Compile up
							object.vertexShader = gl.createShader(gl.VERTEX_SHADER);
						 
							if (object.vertexShader){
								gl.shaderSource(object.vertexShader, vertdata);
								gl.compileShader(object.vertexShader);

								if (!gl.getShaderParameter(object.vertexShader, gl.COMPILE_STATUS)) {
									alert(gl.getShaderInfoLog(object.vertexShader));
									return;
								}

							}
							else{
								alert("No Shader Object could be created!");
								return;
							}

							      
							object.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
								 
							if (object.vertexShader){
								gl.shaderSource(object.fragmentShader, fragdata);
								gl.compileShader(object.fragmentShader);

								if (!gl.getShaderParameter(object.fragmentShader, gl.COMPILE_STATUS)) {
									alert(gl.getShaderInfoLog(object.fragmentShader));
									return;
								}

							}
							else{
								alert("No Shader Object could be created!");
								return;
							}

										
							object.shaderProgram = gl.createProgram();
								
							gl.attachShader(object.shaderProgram, object.vertexShader);
							gl.attachShader(object.shaderProgram, object.fragmentShader);

							gl.linkProgram(object.shaderProgram);

							// Test for uniforms
					


        					}else{ alert('Data file ' + vertpath + 'was empty!'); }
					}     
              				,error: function(){ alert('Error loading ' + vertpath); Saito.resources--;} 
                
     				});
      

        		}else{ alert('Data file ' + vertpath + 'was empty!'); }
		}     
              	,error: function(){ alert('Error loading ' + vertpath); Saito.resources--; } 
                
     	});

}

/**
 * Set a uniform of 3 floats
 */

SaitoShader.prototype.setUniform3f = function( name, v0,v1,v2) {
	if (this.shaderProgram != undefined){
		var uniform = gl.getUniformLocation(this.shaderProgram, name);
			gl.uniform3f(uniform,v0,v1,v2);	
	}
}



/**
 * Set a uniform of 1 float
 */

SaitoShader.prototype.setUniform1f = function( name, variable) {
	if (this.shaderProgram != undefined){
		var uniform = gl.getUniformLocation(this.shaderProgram, name);
		gl.uniform1f(uniform,variable);
	}
}

/**
 * Set a uniform of 1 integer */

SaitoShader.prototype.setUniform1i = function( name, variable) {
	if (this.shaderProgram != undefined){
		var uniform = gl.getUniformLocation(this.shaderProgram, name);
		gl.uniform1i(uniform,variable);
	}
}





/**
 * Set a uniform from a Sylvester Matrix
 */

SaitoShader.prototype.setUniformSylvesterMatrix = function( name, variable) {
	if (this.shaderProgram != undefined){
		var uniform = gl.getUniformLocation(this.shaderProgram, name);	
		gl.uniformMatrix4fv(uniform, false, new Float32Array(variable.flatten()));
 	}
}

/**
 * Enable an array with a name. Call these in order
 */

SaitoShader.prototype.enableAttribArray = function(name) {
	if (this.shaderProgram != undefined){
		var position = gl.getAttribLocation(this.shaderProgram, name);
		gl.enableVertexAttribArray(position);
	}
}

/**
 * Grab an attribute location
 */

SaitoShader.prototype.getAttribArray = function(name) {
	if (this.shaderProgram != undefined){
		return gl.getAttribLocation(this.shaderProgram, name);
	}
}

/**
 * Set the shader active
 */ 

SaitoShader.prototype.setActive = function() {
	if (this.shaderProgram != undefined){
		Saito.currentShader = this;
		gl.useProgram(this.shaderProgram);
	}
}

/**
 * Set the shader inactive
 */ 


SaitoShader.prototype.setInactive = function() {
	Saito.currentShader = null;
	gl.useProgram(null);
}


/**
 * The Texture Class
 */

SaitoTexture = function(path) {
	this.texImage = new Image();
	this.texture = gl.createTexture();

	this.texture.image = this.texImage;
	this.texImage.src = path;

	Saito.resources++;
	var obj = this;
	
	this.texImage.onload = function() {
		Saito.resources--;
        
            	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            	gl.bindTexture(gl.TEXTURE_2D,obj.texture);
            	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.texture.image);
            	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            	gl.generateMipmap(gl.TEXTURE_2D);
            	gl.bindTexture(gl.TEXTURE_2D, null);
    	}
	
}

/**
 * Bind Texture2D
 */

SaitoTexture.prototype.bind = function() {
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
}


SaitoTexture.prototype.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
}	



/**
 * The Texture Cube Class
 * Takes a path, then adds a number with an underscore from 0 to 5, then an extension
 * security.fileuri.strict_origin_policy needs to be off in Firefox for local files
 * \todo formats of images not always RGBA
 */


SaitoTextureCube = function (path, extension) {


	this.texture = gl.createTexture();
        this.texImages = new Array();
        this.loadedTextures = 0;
      
	for (var i= 0; i < 6; ++i){
      		this.texImages[i] = new Image();
		Saito.resources++;
		this.texImages[i].cubeID = i;
		var obj = this;
     
		this.texImages[i].onload = function() {
			obj.loadedTextures++;
			Saito.resources--;
                	if (obj.loadedTextures == 6){
                    		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    		gl.bindTexture(gl.TEXTURE_CUBE_MAP,obj.texture);
                    	
                             	// Could really do with some mipmapping I think
                 
                    		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     
                    		for (var j= 0; j < 6; ++j){
                        		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.texImages[j]);
                    		}
                    
                    		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                	}
                    
            	}
            
            	this.texImages[i].src = path + "_0" + i + "." + extension;
	}

}

/**
 * Bind Texture Cube
 */

SaitoTextureCube.prototype.bind = function() {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
}

SaitoTextureCube.prototype.unbind = function() {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}



/**
 * Matrix Functions
 * Apparently we don't get these by default? Seems odd!
 * This gives us our projection and perspective matrices
 * \todo move to Saito Object
 */

Saito.prototype.modelViewMatrix = Matrix.I(4);
Saito.prototype.projectionMatrix = Matrix.I(4);
Saito.prototype.modelViewMatrixStack = [];

function mvPushMatrix(m) {
    if (m) {
        Saito.prototype.modelViewMatrixStack.push(m.dup());
        Saito.prototype.modelViewMatrix = m.dup();
    } else {
       Saito.prototype.modelViewMatrixStack.push(Saito.prototype.modelViewMatrix.dup());
    }
}


function mvPopMatrix() {
    if (Saito.prototype.modelViewMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    Saito.prototype.modelViewMatrix = Saito.prototype.modelViewMatrixStack.pop();
    return Saito.prototype.modelViewMatrix;
}

function loadIdentity() {
    Saito.prototype.modelViewMatrix = Matrix.I(4);
}


function multMatrix(m) {
    Saito.prototype.modelViewMatrix = Saito.prototype.modelViewMatrix.x(m);
}


function mvTranslate(v) {
    var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
    multMatrix(m);
}

function createScaleMatrix(v) {
    return Matrix.Diagonal([v[0], v[1], v[2] , 1]);
}

function mvScale(v) {
    var m = createScaleMatrix(v).ensure4x4();
    multMatrix(m);    
}


function createRotationMatrix(angle, v) {
    var arad = angle * Math.PI / 180.0;
    return Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
}

function mvRotate(angle, v) {
    multMatrix(createRotationMatrix(angle, v));
}
    
var projectionMatrix;
function perspective(fovy, aspect, znear, zfar) {
    Saito.prototype.projectionMatrix = makePerspective(fovy, aspect, znear, zfar);
}

// This function takes our OpenGL / Sylvester Matrices and creates something nice a shader can use
function setMatrixUniforms(shader) {
	if (shader != "none"){

		shader.setUniformSylvesterMatrix("uModelViewMatrix", Saito.prototype.modelViewMatrix);
		shader.setUniformSylvesterMatrix("uProjectionMatrix", Saito.prototype.projectionMatrix);
    
        	var normalMatrix = Saito.prototype.modelViewMatrix.inverse();
       	 	normalMatrix = normalMatrix.transpose();
		shader.setUniformSylvesterMatrix("uNormalMatrix", normalMatrix); 
	 }
}



/**
 * Mouse and Keyboard Callbacks and functions
 *
 * This function returns values between -1 and 1 with the origin
 * at the center of the canvas
 */

function setMouseHandler() {
    Saito.mouseX = 0;
    Saito.mouseY = 0;
    
    Saito.mouseXprev = 0;
    Saito.mouseYprev = 0;
    
    Saito.mouseXstart = 0;
    Saito.mouseYstart = 0;
    
    Saito.mouseDown = false;

    $(Saito.canvas).mousemove(function(event) {
        var vc = $(Saito.canvas).position();
        Saito.mouseX =   event.pageX - vc.left;
        Saito.mouseY =   event.pageY - vc.top;
        
        Saito.mouseX = Saito.mouseX - (Saito.canvas.width / 2); 
        Saito.mouseY = Saito.mouseY - (Saito.canvas.height / 2); 
    
        Saito.mouseX  /=   (Saito.canvas.width / 2);
        Saito.mouseY  /=   (Saito.canvas.height / 2);    
   
    });
    
    $(Saito.canvas).mousedown ( function () {
        Saito.mouseDown = true;
        Saito.mouseXstart = Saito.mouseX;
        Saito.mouseYstart = Saito.mouseY;         
    });
    
    $(Saito.canvas).mouseup ( function () {
        Saito.mouseDown = false;         
    });  

	// Relies on the mousewheel jquery addon
	$(Saito.canvas).mousewheel(function(event, delta){
       		if (delta > 0){
			if (Saito.mouseScrollUp != undefined) { Saito.mouseScrollUp(); }
		} 
		else if (delta < 0){
			if (Saito.mouseScrollDown != undefined) { Saito.mouseScrollDown(); }
		}        
	});  
   
}

/**
 * A primitive. Forms the basis for our items. Primitives need to bind to Shaders as we are using attributes to draw things.
 * Not sure if we really need attributes but nevermind. 
 */


function Primitive() {

    // Create a stack of buffers - we may not use them all
	this.vertexPositionBuffer       = gl.createBuffer();
	this.vertexNormalBuffer         = gl.createBuffer();
	this.vertexTextureCoordBuffer   = gl.createBuffer();
	this.vertexColourBuffer        	= gl.createBuffer();
	this.vertexIndexBuffer          = gl.createBuffer();
	this.drawPrimitive		= gl.TRIANGLES;
	this.vertexTangentBuffer	= gl.createBuffer();



	this.draw = function() {
    				
		/// \todo Bind Buffers - This really should be done just once but its nice to have it here now. 
		/// \todo The Attribs are set here which isn't good as it needs to be the same in the shader
			
		if (Saito.currentShader != null && Saito.currentShader != undefined) {
		var shader = Saito.currentShader;		
		var aTextureCoord = shader.getAttribArray("aTextureCoord");
		var aVertexPosition = shader.getAttribArray("aVertexPosition");     
		var aVertexNormal = shader.getAttribArray("aVertexNormal");     
		var aVertexColour = shader.getAttribArray("aVertexColour");     
	     	var aVertexTangent = shader.getAttribArray("aVertexTangent");    
	     
		if (aTextureCoord != -1 && aTextureCoord!= undefined) {
			gl.enableVertexAttribArray(aTextureCoord);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.vertexAttribPointer(aTextureCoord, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		} 
		    
			    
		if (aVertexNormal != -1 && aVertexNormal != undefined) {
			gl.enableVertexAttribArray(aVertexNormal);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
			gl.vertexAttribPointer(aVertexNormal, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}
		
		if (aVertexColour != -1 && aVertexColour != undefined) {
			gl.enableVertexAttribArray(aVertexColour);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColourBuffer);
			gl.vertexAttribPointer(aVertexColour, this.vertexColourBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (aVertexPosition!= -1 && aVertexPosition != undefined) {
			gl.enableVertexAttribArray(aVertexPosition);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(aVertexPosition, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}
		
		if (aVertexTangent!= -1 && aVertexTangent != undefined) {
			gl.enableVertexAttribArray(aVertexTangent);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTangentBuffer);
			gl.vertexAttribPointer(aVertexTangent, this.vertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		setMatrixUniforms(shader);
		gl.drawElements(this.drawPrimitive, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT,0);
		}

   	}
}

/**
 * A simple Colour class
 * Takes four floats 0 - 1.0 
 */


Colour = function(r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

Colour.prototype.asArray = function() {
	var ar = new Array();
	ar.push(this.r);
	ar.push(this.g);
	ar.push(this.b);
	ar.push(this.a);
	return ar;
}

/**
 * A few size classes
 */


Size2 = function(w,h) {
	this.w = w;
	this.h = h;
	this.v = $V([w,h]);
}



/**
 * Utilities
 */


function radToDeg ( val ) { return val * 57.2957795; }
function degToRad ( val ) { return val * 0.017453292523928; }




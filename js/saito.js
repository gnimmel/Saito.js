/*                     __  .__              ________ 
   ______ ____   _____/  |_|__| ____   ____/   __   \
  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
 /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
      \/     \/     \/                    \/         
 
THE GHOST IN THE CSH
 
SAITO.JS  v.01

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

/**
 *\todo reindent and recomment
 *\todo shader should be one call with both parts returning a shader object
 */

/**
 * Globals
 */
var gl;

var DEBUG = true;
var USEJQUERYUI = true;

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

	},
    	
	_tick : function() {
	    
		var timeNow = new Date().getTime();
        	if (Saito.lastTime  != 0) {
			Saito.elapsed = timeNow - Saito.lastTime;
        	}
        	Saito.lastTime  = timeNow;
	
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

	_resize: function() {
		gl.viewportWidth = Saito.width = this.canvas.width;
        	gl.viewportHeight = Saito.height = this.canvas.height;

		Saito.resize();
	}
	
};

/**
 * Saito Member Variables 
 */

Saito.lastTime = 0;	
Saito.elapsed = 0;
Saito.width = 0;
Saito.height = 0;
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
    	}
 
};


var $S = Saito;

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

SaitoShader.prototype.setUniform3f = function( name, variable) {
	if (this.shaderProgram != undefined){
		var uniform = gl.getUniformLocation(this.shaderProgram, name);
		gl.uniform3f(uniform,variable[0],variable[1],variable[2]);
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
		gl.useProgram(this.shaderProgram);
	}
}

/**
 * Set the shader inactive
 */ 


SaitoShader.prototype.setInactive = function() {
//	gl.useProgram(0);
}


/**
 * The Texture Class
 */

texture = function(path) {
	this.texImage = new Image();
	this.texture = gl.createTexture();

	this.texture.image = this.texImage;
	this.texImage.src = path;

	Saito.resources++;

	texImage.onload = function() {
		Saito.resources--;
        
            	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            	gl.bindTexture(gl.TEXTURE_2D,this.texture);
            	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
            	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            	gl.generateMipmap(gl.TEXTURE_2D);
            	gl.bindTexture(gl.TEXTURE_2D, null);
    	}
	
}


/**
 * Resource handling
 * This handles all external things like shaders, models
 * and textures
 */

/*
var ResourceLoader = {
    
    // Take the start of a path and add on at least 00 -> 05 for each!
    // takes the given extension
    
    addTextureCube : function (path, tag, extension) {

        var texture = gl.createTexture();
      
        var texImages = new Array();
        
        var loadedTextures = 0;
      
        for (var i= 0; i < 6; ++i){
      
            texImages[i] = new Image();
            this.nLoaded++;
          
            texImages[i].cubeID = i;
                    
            texImages[i].onload = function() {
                
                loadedTextures ++;
                ResourceLoader._checkStatus();
                
                if (loadedTextures == 6){
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
                    
                 
                    // Could really do with some mipmapping I think
                 
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     
                    for (var j= 0; j < 6; ++j){
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImages[j]);
                    }
                    
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                }
                    
            }
            
            texImages[i].src = path + "_0" + i + "." + extension;

        }
        
        if (tag == undefined) tag = "r" + this.resources.length;
        ResourceLoader.resources.push( [texture,tag] );
        ResourceLoader.resourceByTag[tag] = texture;
            
    },
    
    _checkStatus : function() {
        this.nLoaded--;
	if (USEJQUERYUI){
        $( "#progressbar" ).progressbar({
		    value: (this.nToLoad - this.nLoaded) / this.nToLoad * 100
        });
        }
        if (this.nLoaded == 0){
	  if(USEJQUERYUI){
            $( "#dialog-modal" ).dialog( "close" );
            $( "#progressbar" ).progressbar("destroy");
          }
        }
    
    },
  

        
    
	_addResource: function(path, tag, sfunc){
	    if (tag == undefined) tag = "r" + this.resources.length;
	    this.resources.push( [path,tag,sfunc] );
	    this.nLoaded++; 
    },
    
    _load : function () {
    
        // Only make AJAX Calls for things that aren't images
        // here is where we load the dialog for loading
        
        this.nToLoad = this.nLoaded;
        if(USEJQUERYUI){
          $( "#dialog" ).dialog( "destroy" );

          $( "#dialog-modal" ).dialog({
            height: 110,
            modal: true
          });
    
          $( "#progressbar" ).progressbar({
			value: 0
		});
          }
    
        $.each(ResourceLoader.resources,function(index,item) {
          
            // cheat for now and assume that if the item is length 3 we are good to go 
            if (item.length == 3){
          
// Client side fix to stop Firefox parsing non XML data
// http://stackoverflow.com/questions/335409/jquery-getjson-firefox-3-syntax-error-undefined
$.ajaxSetup({'beforeSend': function(xhr){
    if (xhr.overrideMimeType)
        xhr.overrideMimeType("text/plain");
    }
});


            $.ajax({
                    url: item[0],
                    success: function(data){
                     
                        if (data){
                            if (DEBUG) alert("Loaded " + item[0] + "\n\n");
                            ResourceLoader._checkStatus();
    
                            var ro = item[2](data);
                           
                            ResourceLoader.resourceByTag[item[1]] = ro;
                            
                            if (ResourceLoader.nLoaded == 0)
                                Saito.prototype._allIsLoaded();
                        }else{
                            alert('Data file ' + item[0] + 'was empty!');
                        }     
		}
                   ,
		    error: function(){
		    	alert('Error loading ' + item[0]);
 			$( "#dialog-modal" ).dialog( "close" );
           	    } 
                
                });
            }
        });

    },
    
    isReady : function() {
        return (this.nLoaded == 0);
    }
       
};*/


/**
 * Matrix Functions
 * Apparently we don't get these by default? Seems odd!
 * This gives us our projection and perspective matrices
 * \todo move to Saito Object
 */

var modelViewMatrix;
var modelViewMatrixStack = [];

function mvPushMatrix(m) {
    if (m) {
        modelViewMatrixStack.push(m.dup());
        modelViewMatrix = m.dup();
    } else {
        modelViewMatrixStack.push(modelViewMatrix.dup());
    }
}


function mvPopMatrix() {
    if (modelViewMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    modelViewMatrix = modelViewMatrixStack.pop();
    return modelViewMatrix;
}

function loadIdentity() {
    modelViewMatrix = Matrix.I(4);
}


function multMatrix(m) {
    modelViewMatrix = modelViewMatrix.x(m);
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
    projectionMatrix = makePerspective(fovy, aspect, znear, zfar);
}

// This function takes our OpenGL / Sylvester Matrices and creates something nice a shader can use
function setMatrixUniforms(shader) {
	if (shader != "none"){

		shader.setUniformSylvesterMatrix("uModelViewMatrix", modelViewMatrix);
		shader.setUniformSylvesterMatrix("uProjectionMatrix", projectionMatrix);
    
        	var normalMatrix = modelViewMatrix.inverse();
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
	this.vertexColorBuffer          = gl.createBuffer();
	this.vertexIndexBuffer          = gl.createBuffer();
	this.drawPrimitive		= gl.TRIANGLES;
	



	this.draw = function (shader) {
    		shader.setActive();
		
		/// \todo Bind Buffers - This really should be done just once but its nice to have it here now. 
		/// \todo The Attribs are set here which isn't good as it needs to be the same in the shader
					
		var aTextureCoord = shader.getAttribArray("aTextureCoord");
		var aVertexPosition = shader.getAttribArray("aVertexPosition");     
		var aVertexNormal = shader.getAttribArray("aVertexNormal");     
		var aVertexColour = shader.getAttribArray("aVertexColour");     
	     
	     
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
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
			gl.vertexAttribPointer(aVertexColour, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (aVertexPosition!= -1 && aVertexPosition != undefined) {
			gl.enableVertexAttribArray(aVertexPosition);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(aVertexPosition, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}


		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		setMatrixUniforms(shader);
		gl.drawElements(this.drawPrimitive, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT,0);

		//shader.setInactive();
   	}
}

function createCuboid(width,height,depth) {
    var cube = new Primitive;
   
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexPositionBuffer);
   
    width /=2;
    height /=2;
    depth /=2;
     
    vertices = [
      // Front face
      -width, -height,  depth,
       width, -height,  depth,
       width,  height,  depth,
      -width,  height,  depth,

      // Back face
      -width, -height, -depth,
      -width,  height, -depth,
       width,  height, -depth,
       width, -height, -depth,

      // Top face
      -width,  height, -depth,
      -width,  height,  depth,
       width,  height,  depth,
       width,  height, -depth,

      // Bottom face
      -width, -height, -depth,
       width, -height, -depth,
       width, -height,  depth,
      -width, -height,  depth,

      // Right face
       width, -height, -depth,
       width,  height, -depth,
       width,  height,  depth,
       width, -height,  depth,

      // Left face
      -width, -height, -depth,
      -width, -height,  depth,
      -width,  height,  depth,
      -width,  height, -depth,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    cube.vertexPositionBuffer.itemSize = 3;
    cube.vertexPositionBuffer.numItems = 24;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexNormalBuffer);
    var vertexNormals = [
      // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

      // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

      // Top face
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

      // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

      // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

      // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
    ];
        
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    cube.vertexNormalBuffer.itemSize = 3;
    cube.vertexNormalBuffer.numItems = 24;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexTextureCoordBuffer);
    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cube.vertexTextureCoordBuffer.itemSize = 2;
    cube.vertexTextureCoordBuffer.numItems = 24;
    

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cube.vertexIndexBuffer.itemSize = 1;
    cube.vertexIndexBuffer.numItems = 36;
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexColorBuffer);
    var colors = [
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [0.0, 0.0, 1.0, 1.0],     // Left face
    ];
    var unpackedColors = []
    for (var i in colors) {
      var color = colors[i];
      for (var j=0; j < 4; j++) {
        unpackedColors = unpackedColors.concat(color);
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    cube.vertexColorBuffer.itemSize = 4;
    cube.vertexColorBuffer.numItems = 24;

    return cube;
}


function createSphere(latitudeBands,longitudeBands) {
    
    if (latitudeBands == undefined)     latitudeBands = 5;
    if (longitudeBands == undefined)  longitudeBands = 5;
    
    var radius = 1;
    
    var sphere = new Primitive;
    
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    var colorData = [];
    
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        
        colorData.push(1.0);
        colorData.push(1.0);
        colorData.push(1.0);
        colorData.push(1.0);
        
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }
 
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    sphere.vertexNormalBuffer.itemSize = 3;
    sphere.vertexNormalBuffer.numItems = normalData.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    sphere.vertexTextureCoordBuffer.itemSize = 2;
    sphere.vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;
 
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    sphere.vertexPositionBuffer.itemSize = 3;
    sphere.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    sphere.vertexIndexBuffer.itemSize = 1;
    sphere.vertexIndexBuffer.numItems = indexData.length;
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexColorBuffer);
   
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    sphere.vertexColorBuffer.itemSize = 4;
    sphere.vertexColorBuffer.numItems = colorData.length;

    return sphere;

}

/**
 *  Model Loading functions.
 */

// A model is essentially a class with its own buffer objects
// doesnt differ much from a primitive but it will probably!

function Model() {
    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexNormalBuffer = gl.createBuffer();
    this.vertexTextureCoordBuffer = gl.createBuffer();
    this.vertexIndexBuffer = gl.createBuffer();
    
    this.bindToShader = function (shaderProgram) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
          gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
          setMatrixUniforms();
          gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    this.draw = function () {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexPositionBuffer.numItems);
    }
}

function handleLoadedModel(modelData) {
    
    var nm = new Model;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, nm.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertexNormals), gl.STATIC_DRAW);
    laptopVertexNormalBuffer.itemSize = 3;
    laptopVertexNormalBuffer.numItems = modelData.vertexNormals.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, nm.vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertexTextureCoords), gl.STATIC_DRAW);
    laptopVertexTextureCoordBuffer.itemSize = 2;
    laptopVertexTextureCoordBuffer.numItems = modelData.vertexTextureCoords.length / 2;

    gl.bindBuffer(gl.ARRAY_BUFFER, nm.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.vertexPositions), gl.STATIC_DRAW);
    laptopVertexPositionBuffer.itemSize = 3;
    laptopVertexPositionBuffer.numItems = modelData.vertexPositions.length / 3;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, nm.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), gl.STREAM_DRAW);
    laptopVertexIndexBuffer.itemSize = 1;
    laptopVertexIndexBuffer.numItems = modelData.indices.length;
    
    return nm;
    
}

function loadModel(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            return handleLoadedModel(JSON.parse(request.responseText));
        }
    }
    request.send();
}

// ****************************************************
// Utilities
// ****************************************************

function radToDeg ( val ) { return val * 57.2957795; }
function degToRad ( val ) { return val * 0.017453292523928; }




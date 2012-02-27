/**
 * Saito OBJ Model Loader
 */

 // http://www.canvasdemos.com/userdemos/toxicgonzo/3dobjviewer.html


/*var plane = new Primitive;
   
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexPositionBuffer);
   
	width = size.w / 2;
	height = size.h / 2;
	depth = 0;
     
	vertices = [
		-width, -height,  depth,
       		width, -height,  depth,
       		width,  height,  depth,
      		-width,  height,  depth,
    	];
    
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    	plane.vertexPositionBuffer.itemSize = 3;
    	plane.vertexPositionBuffer.numItems = 4;
    
    	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexNormalBuffer);

	var vertexNormals = [
      	// Front face
       		0.0,  0.0,  1.0,
       		0.0,  0.0,  1.0,
      	 	0.0,  0.0,  1.0,
       		0.0,  0.0,  1.0
        ];
        

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	plane.vertexNormalBuffer.itemSize = 3;
 	plane.vertexNormalBuffer.numItems = 4;
    
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexTextureCoordBuffer);
    	var textureCoords = [
      		0.0, 0.0,
     	    1.0, 0.0,
      		1.0, 1.0,
      		0.0, 1.0,
        ];


	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	plane.vertexTextureCoordBuffer.itemSize = 2;
	plane.vertexTextureCoordBuffer.numItems = 4;
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertexIndexBuffer);
	var cubeVertexIndices = [
      		0, 1, 2,      0, 2, 3,    // Front face
       	];
    
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	plane.vertexIndexBuffer.itemSize = 1;
	plane.vertexIndexBuffer.numItems = 6;
    
    
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexColourBuffer);

	var ar = colour.asArray();
	
	var colours = [ar];

    	var unpackedColours = []
    	for (var i in colours) {
      		var c = colours[i];
      		for (var j=0; j < 4; j++) {
        		unpackedColours = unpackedColours.concat(c);
      		}
    	}
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColours), gl.STATIC_DRAW);
	plane.vertexColourBuffer.itemSize = 4;
	plane.vertexColourBuffer.numItems = 4;

	return plane;*/

var loadModelOBJ = function (objfile) {
	
	// Ajax Request for the Model info
	Saito.resources++;

	var model = new Primitive();

	$.ajaxSetup({'beforeSend': function(xhr){
    	if (xhr.overrideMimeType)
        	xhr.overrideMimeType("text/plain");
    }});

	// Load Model
	$.ajax({
    	url: objfile,
		success: function(objdata){ 

			var g_cubeOBJparsed = objdata.split(" ");
			
	  	  	var polygonsArray = [];
	  	  	var centroidVerticesArray = [];
	  	  	var transformMatrix = new Matrix();
	  	  	var normalsArray = [];

			var dataCount;
			var verticesCount;
			var verticesArray = [];
	     
	    	for (dataCount = 0; dataCount < g_cubeOBJparsed.length; dataCount++) {
		    	if (g_cubeOBJparsed[dataCount] == "v"){

	  	  			verticesArray.push($V([parseFloat(g_cubeOBJparsed[dataCount+1]),
	  	  	   	   		parseFloat(g_cubeOBJparsed[dataCount+2]),
	  	  	   	   		parseFloat(g_cubeOBJparsed[dataCount+3])]));
	  	 		}
	  	  	  
		  		if (g_cubeOBJparsed[dataCount] == "f"){
			  	
		  	  		verticesCount = dataCount+1;
		  	  	   	   
		  			while (g_cubeOBJparsed[verticesCount] != "f" && verticesCount < g_cubeOBJparsed.length ) {

		  				var vertex =  g_cubeOBJparsed[verticesCount]-1;

		  	  	   		polygonsArray.push(vertex.e(1));
		  	  	   		polygonsArray.push(vertex.e(2));
		  	  	   		polygonsArray.push(vertex.e(3));   
		  	  	   	   	verticesCount = verticesCount+1;  
		  	  		}

		  	  		///\todo should sort out the OBJ file for any non triangle faces
		  	  		/// Need to check for triangles or similar here! :S Assume triangles for now! NAUGHTY
		  		}

		  		// Loop through the triangles (assuming they are)
		  		gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPositionBuffer);

	  	  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polygonsArray), gl.STATIC_DRAW);
	  	  		model.vertexPositionBuffer.itemSize = 3;
				model.vertexPositionBuffer.numItems = polygonsArray.length / 3;

				///\todo can actually use the OBJ indicies here which might be better

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.vertexIndexBuffer);
				var objVertexIndices = [];
				for (var i=0; i < model.vertexPositionBuffer.numItems; i++){
					objVertexIndices.push(i);
				}
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objVertexIndices), gl.STATIC_DRAW);
				model.vertexIndexBuffer.itemSize = 1;
				model.vertexIndexBuffer.numItems = objVertexIndices.length;


				///\todo colours I believe are defined in OBJ as well - using white for now

				var objColours = [];
				for (var i=0; i < model.vertexPositionBuffer.numItems; i++){
					objColours.push(1.0);
					objColours.push(1.0);
					objColours.push(1.0);
					objColours.push(1.0);
				}

				gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexColourBuffer);

				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objColours), gl.STATIC_DRAW);
				model.vertexColourBuffer.itemSize = 4;
				model.vertexColourBuffer.numItems = model.vertexPositionBuffer.numItems;

	  		}
	 

	  		Saito.resources--;
	  	},
	  	error: function(){
	  		alert("Failed to Load OBJ: " + objfile);
	  	}  	   
  	});
   
	return model;	
}

          
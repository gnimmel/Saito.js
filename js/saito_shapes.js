function createCuboid(width,height,depth,colour) {
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
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexColourBuffer);
    
    var colours = [];

    if (colour != null){
      for (var i=0; i < 6; i++)
        colours.push( Colour.prototype.asArray()); 
    } else {
      colours = [
        [1.0, 0.0, 0.0, 1.0],     // Front face
        [1.0, 1.0, 0.0, 1.0],     // Back face
        [0.0, 1.0, 0.0, 1.0],     // Top face
        [1.0, 0.5, 0.5, 1.0],     // Bottom face
        [1.0, 0.0, 1.0, 1.0],     // Right face
        [0.0, 0.0, 1.0, 1.0],     // Left face
      ];
    }
    var unpackedColours = []
    for (var i in colours) {
      var colour = colours[i];
      for (var j=0; j < 4; j++) {
        unpackedColours = unpackedColours.concat(colour);
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColours), gl.STATIC_DRAW);
    cube.vertexColourBuffer.itemSize = 4;
    cube.vertexColourBuffer.numItems = 24;

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
    var colourData = [];
	var tangentData = [];
    
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
        
        colourData.push(1.0);
        colourData.push(1.0);
        colourData.push(1.0);
        colourData.push(1.0);
        
        textureCoordData.push(u);
        textureCoordData.push(v);

	var vs = $V([radius *x, radius *y, radius *z]);
	var ns = $V([0,1,0]);

        vertexPositionData.push(vs.e(1));
        vertexPositionData.push(vs.e(2));
        vertexPositionData.push(vs.e(3));

	vs = vs.cross(ns);
	vs = vs.toUnitVector();
	
	if(latNumber == 0){
		vs = $V([0,0,1]);
	}

        tangentData.push(vs.e(1));
        tangentData.push(vs.e(2));
        tangentData.push(vs.e(3));

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

	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexTangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangentData), gl.STATIC_DRAW);
    sphere.vertexTangentBuffer.itemSize = 3;
    sphere.vertexTangentBuffer.numItems = tangentData.length / 3;


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    sphere.vertexIndexBuffer.itemSize = 1;
    sphere.vertexIndexBuffer.numItems = indexData.length;
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexColourBuffer);
   
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colourData), gl.STATIC_DRAW);
    sphere.vertexColourBuffer.itemSize = 4;
    sphere.vertexColourBuffer.numItems = colourData.length;

    return sphere;

}



/** 
* Drawing Curves
*/

///\todo Needs normals to be added!

function B1(t) { return t*t*t }
function B2(t) { return 3*t*t*(1-t) }
function B3(t) { return 3*t*(1-t)*(1-t) }
function B4(t) { return (1-t)*(1-t)*(1-t) }

// val is 0-1
function pointOnCurve(val,v0,v1,v2,v3) {
  var pos = $V([
  v0.e(1)*B1(val) + v1.e(1)*B2(val) + v2.e(1)*B3(val) + v3.e(1)*B4(val),
  v0.e(2)*B1(val) + v1.e(2)*B2(val) + v2.e(2)*B3(val) + v3.e(2)*B4(val),
  v0.e(3)*B1(val) + v1.e(3)*B2(val) + v2.e(3)*B3(val) + v3.e(3)*B4(val)]);
  
  return pos;
}

function createCurve(start, end, c0, c1, facing, segments, w, r,g,b,a) {

	var curve = new Primitive;
   	var alignAxis = facing;
   	var width = w;
	
	// Create the Vertices for this curve as a triangle strip facing the 
	// align axis vector (may need to mess with this in a shader to keep it
	// facing the viewer (billboarding)
   	
	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexPositionBuffer);
    
  	var vertices = [];
  
  	// Direction gives the next point - this is point segment 0 to 1

  	var vert0 = pointOnCurve(0.0, start, c0,c1, end); // First point
  	var vert3 = pointOnCurve(1.0 / segments, start, c0,c1, end);
  	var dir = vert0.subtract(vert3); // Going back
  	var up = dir.cross(alignAxis);
  	up = up.multiply(1.0/up.modulus() * width);
 
  	var vert1 = vert0.add(up); // going up to second
  	var vert2 = vert3.add(up); // across to third point
  	
  	vertices.push(vert1.e(1)); vertices.push(vert1.e(2)); vertices.push(vert1.e(3));
  	vertices.push(vert0.e(1)); vertices.push(vert0.e(2)); vertices.push(vert0.e(3));
	vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
	vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));

   	for (var i=2; i < segments; i ++){
		vert0 = pointOnCurve((i-1)/segments, start, c0,c1,end);
		vert3 = pointOnCurve(i/segments, start, c0,c1,end);
		var dir = vert0.subtract(vert3); // Going back
		var up = dir.cross(alignAxis);
		up = up.multiply(1.0/up.modulus() * width);
		
  		vert2 = vert3.add(up); // across to third point
  	
		vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
		vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));
	}
 
    
	var colours = [];
    
  	for (var i=0; i < segments * 2; i ++){
   		colours.push(r);
   		colours.push(g);
   		colours.push(b);
   		colours.push(a);
   	}
   	
   	var curveVertexIndices = [];

   	for (var i=0; i < segments * 2; i ++){
   		curveVertexIndices.push(i);
   	}
   
 	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    	curve.vertexPositionBuffer.itemSize = 3;
    	curve.vertexPositionBuffer.numItems = vertices.length / 3;

	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexColourBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
	curve.vertexColourBuffer.itemSize = 4;
	curve.vertexColourBuffer.numItems = colours.length / 4;
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, curve.vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curveVertexIndices), gl.STATIC_DRAW);
	curve.vertexIndexBuffer.itemSize = 1;
	curve.vertexIndexBuffer.numItems = curveVertexIndices.length;
 
	curve.drawPrimitive = gl.TRIANGLE_STRIP;
	
	return curve;
}

// Create a Square 3D Curve
function createCurveCube(start, end, c0, c1, facing, segments, w, r,g,b,a) {
	
  var curve = new Primitive;
   	var alignAxis = facing;
   	var width = w;
	
	// Create the Vertices for this curve as a triangle strip facing the 
	// align axis vector (may need to mess with this in a shader to keep it
	// facing the viewer (billboarding)
   
 	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexPositionBuffer);
    
  	var vertices = [];
	var normals = [];
  
  	// Direction gives the next point - this is point segment 0 to 1

  	var vert0 = pointOnCurve(0, start, c0,c1, end); // First point
  	var vert3 = pointOnCurve(1.0 / segments, start, c0,c1, end);
  	var dir = vert0.subtract(vert3); // Going back
  	var up = dir.cross(alignAxis);
  	up = up.multiply(1.0/up.modulus() * width);
 
  	var vert1 = vert0.add(up); // going up to second
  	var vert2 = vert3.add(up); // across to third point
  	
  	vertices.push(vert1.e(1)); vertices.push(vert1.e(2)); vertices.push(vert1.e(3));
  	vertices.push(vert0.e(1)); vertices.push(vert0.e(2)); vertices.push(vert0.e(3));
	vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
	vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));
	
	normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));
	normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));
	normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));
	normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));

	var size = 4;
	// Front Face
   	for (var i=2; i <= segments; i ++){
		vert0 = pointOnCurve((i-1)/segments, start, c0,c1,end);
		vert3 = pointOnCurve(i/segments, start, c0,c1,end);
		var dir = vert0.subtract(vert3); // Going back
		var up = dir.cross(alignAxis);
		up = up.multiply(1.0/up.modulus() * width);
		
  		vert2 = vert3.add(up); // across to third point
		vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
		vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));
		size +=2;

		normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));
		normals.push(facing.e(1)); normals.push(facing.e(2)); normals.push(facing.e(3));

	}
	
	var halfSize = size;
  	 
	
	// Back Face
   	for (var i= segments; i >= 0; i--){
		vert0 = pointOnCurve((i-1)/segments, start, c0,c1,end);
		vert3 = pointOnCurve(i/segments, start, c0,c1,end);
		var dir = vert0.subtract(vert3); // Going back
		var up = dir.cross(alignAxis);
		up = up.multiply(1.0/up.modulus() * width);
		
  		vert2 = vert3.add(up); // across to third point
		vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3) - width);
		vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3) - width);
		size +=2;
		normals.push(-facing.e(1)); normals.push(-facing.e(2)); normals.push(-facing.e(3));
		normals.push(-facing.e(1)); normals.push(-facing.e(2)); normals.push(-facing.e(3));

	}
	
	// We now have all the points so we just need some indicies
   	
   	var curveVertexIndices = [];

	// This covers the minimum points. We then need to add a few more!
   	for (var i=0; i < size; i ++){
   		curveVertexIndices.push(i);
   	}
   	
   	// End cap
   	curveVertexIndices.push(0);
   	curveVertexIndices.push(1);
   	
   	curveVertexIndices.push(size - 1);
   	
   	// Top Face
   	for (var i=3; i < halfSize; i +=2){
   		curveVertexIndices.push( i );
   		curveVertexIndices.push( size - i );
   	}
   		
   	// Bottom Face ( cant be arsed with degenerate at the moment so just add another tri
  	curveVertexIndices.push(halfSize+1);
  	curveVertexIndices.push(0);

   	for (var i=0; i < halfSize; i +=2){
   		curveVertexIndices.push( i );
   		curveVertexIndices.push( size - 2 - i );
   	}
   	
   
 	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	curve.vertexPositionBuffer.itemSize = 3;
	curve.vertexPositionBuffer.numItems = vertices.length / 3;

	var colours = [];
    
  	for (var i=0; i < vertices.length; i++){
   		colours.push(r);
   		colours.push(g);
   		colours.push(b);
   		colours.push(a);
   	}

	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexColourBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
	curve.vertexColourBuffer.itemSize = 4;
	curve.vertexColourBuffer.numItems = colours.length / 4;
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, curve.vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curveVertexIndices), gl.STATIC_DRAW);
	curve.vertexIndexBuffer.itemSize = 1;
	curve.vertexIndexBuffer.numItems = curveVertexIndices.length;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexNormalBuffer);
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
 	curve.vertexNormalBuffer.itemSize = 3;
	curve.vertexNormalBuffer.numItems = normals.length / 3;
 
	curve.drawPrimitive = gl.TRIANGLE_STRIP;

	return curve;
}


// Worked out on a sphere size of 1 with -90 being south pole, centered at the origin
function createWorldCurveCube(startlat, startlon, endlat, endlon, bend, segments, w, r,g,b,a) {
	startlon = degToRad(startlon);
	endlon = degToRad(endlon);
	startlat = degToRad(startlat);
	endlat = degToRad(endlat);

	var sz = Math.cos(startlon) * Math.cos(startlat);
	var sx = Math.sin(startlon) * Math.cos(startlat);
	var sy = Math.sin(startlat);
	
	var ez = Math.cos(endlon) * Math.cos(endlat);
	var ex = Math.sin(endlon) * Math.cos(endlat);
	var ey = Math.sin(endlat);
	
	var s = $V([sx,sy,sz]);
	var e = $V([ex,ey,ez]);
	
	var d = e.subtract(s);
	var l = d.modulus();
	var dd = d.x(0.25);
	var ddd = d.x(0.75);


	var facing = $V([(sx + ex) / 2.0 , (sy + ey) / 2.0, (sz + ez)  / 2.0]);
	facing = facing.toUnitVector();
	//var facing = $V([0,0,1]);
	var height = facing.x(bend);
	
	var c1 = s.add(dd);
	c1 = c1.add (height);
	var c2 = s.add(ddd);
	c2 = c2.add (height);
	
	return createCurveCube(s, e, c1, c2, facing, segments, w, r,g,b,a);
}


/**
 * create Plane with a size aligned on the X Axis, size being a 2 size array
 */

function createPlane(size,colour) {

	var plane = new Primitive;
   
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

	return plane;

}






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
 
    
	var colors = [];
    
  	for (var i=0; i < segments * 2; i ++){
   		colors.push(r);
   		colors.push(g);
   		colors.push(b);
   		colors.push(a);
   	}
   	
   	var curveVertexIndices = [];

   	for (var i=0; i < segments * 2; i ++){
   		curveVertexIndices.push(i);
   	}
   
 	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    	curve.vertexPositionBuffer.itemSize = 3;
    	curve.vertexPositionBuffer.numItems = vertices.length / 3;

	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	curve.vertexColorBuffer.itemSize = 4;
	curve.vertexColorBuffer.numItems = colors.length / 4;
    
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

	var colors = [];
    
  	for (var i=0; i < vertices.length; i++){
   		colors.push(r);
   		colors.push(g);
   		colors.push(b);
   		colors.push(a);
   	}

	gl.bindBuffer(gl.ARRAY_BUFFER, curve.vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	curve.vertexColorBuffer.itemSize = 4;
	curve.vertexColorBuffer.numItems = colors.length / 4;
    
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

function createPlaneXAxis(size) {

	var plane =  new Primitive();

	// Vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexPositionBuffer);
    
  	var vertices = [];
	var vert1 = $V([size[0],0,size[1]]);
	var vert2 = $V([-size[0],0,size[1]]);
	var vert3 = $V([-size[0],0,-size[1]]);
	var vert4 = $V([size[0],0,-size[1]]);

	vertices.push(vert1.e(1)); vertices.push(vert1.e(2)); vertices.push(vert1.e(3));
	vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
	vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));
	vertices.push(vert4.e(1)); vertices.push(vert4.e(2)); vertices.push(vert4.e(3));
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	plane.vertexPositionBuffer.itemSize = 3;
    	plane.vertexPositionBuffer.numItems = 4;

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexNormalBuffer);
    
  	var normals = [];
	var normal = $V([0,1,0]);
	vertices.push(normal.e(1)); vertices.push(normal.e(2)); vertices.push(normal.e(3));
	vertices.push(normal.e(1)); vertices.push(normal.e(2)); vertices.push(normal.e(3));
	vertices.push(normal.e(1)); vertices.push(normal.e(2)); vertices.push(normal.e(3));
	vertices.push(normal.e(1)); vertices.push(normal.e(2)); vertices.push(normal.e(3));


	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	plane.vertexNormalBuffer.itemSize = 3;
    	plane.vertexNormalBuffer.numItems = 4;

	var indexData = [];
	indexData.push(0);
	indexData.push(1);
	indexData.push(2);
	indexData.push(3);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.vertexIndexBuffer);
    	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    	plane.vertexIndexBuffer.itemSize = 1;
    	plane.vertexIndexBuffer.numItems = indexData.length;
    
	return plane;

}

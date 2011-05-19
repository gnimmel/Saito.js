// ****************************************************
// Drawing Curves
// ****************************************************

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

	var size = 4;
	// Front Face
   	for (var i=2; i < segments; i ++){
		vert0 = pointOnCurve((i-1)/segments, start, c0,c1,end);
		vert3 = pointOnCurve(i/segments, start, c0,c1,end);
		var dir = vert0.subtract(vert3); // Going back
		var up = dir.cross(alignAxis);
		up = up.multiply(1.0/up.modulus() * width);
		
  		vert2 = vert3.add(up); // across to third point
		vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3));
		vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3));
		size +=2;
	}
	
	var halfSize = size;
  	 
	
	// Back Face
   	for (var i= segments-1; i >= 0; i--){
		vert0 = pointOnCurve((i-1)/segments, start, c0,c1,end);
		vert3 = pointOnCurve(i/segments, start, c0,c1,end);
		var dir = vert0.subtract(vert3); // Going back
		var up = dir.cross(alignAxis);
		up = up.multiply(1.0/up.modulus() * width);
		
  		vert2 = vert3.add(up); // across to third point
		vertices.push(vert2.e(1)); vertices.push(vert2.e(2)); vertices.push(vert2.e(3) - width);
		vertices.push(vert3.e(1)); vertices.push(vert3.e(2)); vertices.push(vert3.e(3) - width);
		size +=2;
	}
	
	// We now have all the points so we just need some indicies
	
	var colors = [];
    
  	for (var i=0; i < size; i ++){
   		colors.push(r);
   		colors.push(g);
   		colors.push(b);
   		colors.push(a);
   	}
   	
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
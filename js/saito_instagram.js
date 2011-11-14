/**
 * A set of planes that represent a cuboid, therefore each can have a texture
 * Only pass the visible planes - saves on drawing calls
 */


InstaCube = function(size) {
 	this.planes = new Array();
 	this.size = size;
 	this.textures = new Array();
 	for (var i=0; i < 6; i++){
 		this.planes.push(new createPlane(size, new Colour(1.0,1.0,1.0,1.0) ));
 	}
 }

/**
 * Pass a texture and position to set our cubes up
 */

 InstaCube.prototype.setTexture = function(t, pos) {
 	if (pos >= this.textures.length ){
 		this.textures.push(t);
 	}
 	else{
 		this.textures[pos] = t;
 	}
 }

 InstaCube.prototype.draw = function() {
 	// Front, back, left, right, top, bottom - perform matrix functions here for now
	this.textures[0].bind();
	mvPushMatrix();
	mvTranslate([0.0,0.0,this.size.w/2.0]);
	this.planes[0].draw();
	mvPopMatrix();
	this.textures[0].unbind(); 
	
	this.textures[1].bind();
	mvPushMatrix();
	mvTranslate([0.0,0.0,-this.size.x/2.0]);
	mvRotate(180.0,[0.0,1.0,0.0] );
	this.planes[1].draw();
	mvPopMatrix();
	this.textures[1].unbind(); 	


	this.textures[2].bind();
	mvPushMatrix();
	mvTranslate([-this.size.x/2.0,0.0,0.0]);
	mvRotate(-90.0,[1.0,0.0,0.0] );
	this.planes[2].draw();
	mvPopMatrix();
	this.textures[2].unbind(); 	

	this.textures[3].bind();
	mvPushMatrix();
	mvTranslate([this.size.x/2.0,0.0,0.0]);
	mvRotate(90.0,[1.0,0.0,0.0] );
	this.planes[3].draw();
	mvPopMatrix();
	this.textures[3].unbind(); 		

	this.textures[4].bind();
	mvPushMatrix();
	mvTranslate([0.0,this.size.x/2.0,0.0]);
	mvRotate(90.0,[1.0,0.0,0.0] );
	this.planes[4].draw();
	mvPopMatrix();
	this.textures[4].unbind();
	
	this.textures[5].bind();
	mvPushMatrix();
	mvTranslate([0.0,0.0,-this.size.x/2.0]);
	mvRotate(-90.0,[1.0,0.0,0.0] );
	this.planes[5].draw();
	mvPopMatrix();
	this.textures[5].unbind(); 

 }
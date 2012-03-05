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

#/todo - use lists here as well for each part of the vector?
#/todo add invalid function as a check / wrapper / token for every function

# Two dimensional Vector -  good for sizes

namespace "CoffeeGL", (exports) ->

  class exports.Vec2
    # Class methods for nondestructively operating
    for name in ['add', 'subtract', 'multiply', 'divide']
    	do (name) ->
    	  Vec2[name] = (a,b) ->
          a.copy()[name](b)

    Vec2.DIM = 2

    constructor: (x=0,y=0) ->
    	[@x,@y] = [x,y]

    copy: ->
      new Vec2(@x,@y)

    length: ->
      Math.sqrt lengthSquared 
    
    lengthSquared: ->
      @x * @x + @y * @y

    normalize: ->
      m = @length
      @divide m if m > 0
      this

    subtract: (v) ->
      @x -= v.x
      @y -= v.y
      this

    add: (v) ->
      @x += v.x
      @y += v.y
      this

    dv: (v) ->
      new Vec2  Math.abs(@x - v.x) Math.abs(@y - v.y) 

    dist: (v) ->
      length dv v

    distSquared: (v) ->
    	lengthSquared dv v

    divide: (n) ->
      [@x,@y] = [@x/n,@y/n]
      this

    multiply: (n) ->
      [@x,@y] = [@x*n,@y*n]
      this

    equals: (v) ->
      @x == v.x && @x == v.y

    dot: (v) ->
      @x*v.x + @y*v.y

    invalid: ->
      return (@x == Infinity) || isNaN(@x) || @y == Infinity || isNaN(@y)


# Vector (3 Dimensions)

  class exports.Vec3
    # Class methods for nondestructively operating
    for name in ['add', 'subtract', 'multiply', 'divide']
    	do (name) ->
    	  Vec3[name] = (a,b) ->
          a.copy()[name](b)

    Vec3.DIM = 3

    constructor: (x=0,y=0,z=0) ->
    	[@x,@y,@z] = [x,y,z]

    copy: ->
      new Vec3(@x,@y,@z)

    length: ->
      Math.sqrt lengthSquared 
    
    lengthSquared: ->
      @x * @x + @y * @y + @z * @z

    normalize: ->
      m = @length
      @divide m if m > 0
      this

    subtract: (v) ->
      @x -= v.x
      @y -= v.y
      @z -= v.z
      this

    add: (v) ->
      @x += v.x
      @y += v.y
      @z += v.z
      this

    dv: (v) ->
      new Vec3  Math.abs(@x - v.x) Math.abs(@y - v.y) Math.abs(@z - v.z) 

    dist: (v) ->
      length dv v

    distSquared: (v) ->
    	lengthSquared dv v

    divide: (n) ->
      [@x,@y,@z] = [@x/n,@y/n,@z/n]
      this

    multiply: (n) ->
      [@x,@y,@z] = [@x*n,@y*n,@z*n]
      this

    equals: (v) ->
      @x == v.x && @y == v.y && @z == v.z

    dot: (v) ->
      @x*v.x + @y*v.y + @z*v.z

    invalid: ->
      return (@x == Infinity) || isNaN(@x) || @y == Infinity || isNaN(@y) || @z == Infinity || isNaN(@z)


# Vector (4 Dimensions)

  class exports.Vec4
    for name in ['add', 'subtract', 'multiply', 'divide']
    	do (name) ->
    	  Vec4[name] = (a,b) ->
          a.copy()[name](b)

    Vec4.DIM = 4

    constructor: (x=0,y=0,z=0,w=1) ->
    	[@x,@y,@z,@w] = [x,y,z,w]

    copy: ->
      new Vec4(@x,@y,@z,@w)

    length: ->
      Math.sqrt lengthSquared 
    
    lengthSquared: ->
      @x * @x + @y * @y + @z * @z + @w * @w

    normalize: ->
      m = @length
      @divide m if m > 0
      this

    subtract: (v) ->
      @x -= v.x
      @y -= v.y
      @z -= v.z
      @w -= v.w
      this
    
    equals: (v) ->
      @x == v.x && @y == v.y && @z == v.z && @w == v.w

    add: (v) ->
      @x += v.x
      @y += v.y
      @z += v.z
      @w += v.w
      this

    dv: (v) ->
      new Vec4  Math.abs(@x - v.x) Math.abs(@y - v.y) Math.abs(@z - v.z) Math.abs(@w - v.w) 

    dist: (v) ->
      length dv v

    distSquared: (v) ->
    	lengthSquared dv v

    divide: (n) ->
      [@x,@y,@z,@w] = [@x/n,@y/n,@z/n,@w/n]
      this

    multiply: (n) ->
      [@x,@y,@z,@w] = [@x*n,@y*n,@z*n,@w*n]
      this

    dot: (v) ->
      @x*v.x + @y*v.y + @z*v.z + @w*v.w

    invalid: ->
      return (@x == Infinity) || isNaN(@x) || @y == Infinity || isNaN(@y) || @z == Infinity || isNaN(@z) || @w == Infinity || isNaN(@w)



# Matrix (4 x 4)

  class exports.Matrix4
    for name in ['add', 'subtract', 'multiply', 'divide', 'addScalar', 'subtractScalar', 'multiplyScalar', 'divideScalar']
    	do (name) ->
    	  Matrix4[name] = (a,b) ->
          a.copy()[name](b)

    Matrix4.DIM = 4

    # Take a list in column major format
    constructor: (@a) ->


    multiplyScalar: (n) ->
      @a = ( num * n for num in @a )
    
    addScalar: (n) ->
      @a = ( num + n for num in @a )

    subtractScalar: (n) ->
      @a = ( num - n for num in @a )

    divideScalar: (n) ->
      @a = ( num / n for num in @a)

    setToIdentity: ->
    	@a = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]

    multiply: (m) ->
      @a[ 0] = @a[0]*m.a[ 0] + @a[ 4]*m.a[ 1] + @a[ 8]*m.a[ 2] + @a[12]*m.a[ 3]
      @a[ 1] = @a[ 1]*m.a[ 0] + @a[ 5]*m.a[ 1] + @a[ 9]*m.a[ 2] + @a[13]*m.a[ 3]
      @a[ 2] = @a[ 2]*m.a[ 0] + @a[ 6]*m.a[ 1] + @a[10]*m.a[ 2] + @a[14]*m.a[ 3]
      @a[ 3] = @a[ 3]*m.a[ 0] + @a[ 7]*m.a[ 1] + @a[11]*m.a[ 2] + @a[15]*m.a[ 3]
      @a[ 4] = @a[ 0]*m.a[ 4] + @a[ 4]*m.a[ 5] + @a[ 8]*m.a[ 6] + @a[12]*m.a[ 7]
      @a[ 5] = @a[ 1]*m.a[ 4] + @a[ 5]*m.a[ 5] + @a[ 9]*m.a[ 6] + @a[13]*m.a[ 7]
      @a[ 6] = @a[ 2]*m.a[ 4] + @a[ 6]*m.a[ 5] + @a[10]*m.a[ 6] + @a[14]*m.a[ 7]
      @a[ 7] = @a[ 3]*m.a[ 4] + @a[ 7]*m.a[ 5] + @a[11]*m.a[ 6] + @a[15]*m.a[ 7]
      @a[ 8] = @a[ 0]*m.a[ 8] + @a[ 4]*m.a[ 9] + @a[ 8]*m.a[10] + @a[12]*m.a[11]
      @a[ 9] = @a[ 1]*m.a[ 8] + @a[ 5]*m.a[ 9] + @a[ 9]*m.a[10] + @a[13]*m.a[11]
      @a[10] = @a[ 2]*m.a[ 8] + @a[ 6]*m.a[ 9] + @a[10]*m.a[10] + @a[14]*m.a[11]
      @a[11] = @a[ 3]*m.a[ 8] + @a[ 7]*m.a[ 9] + @a[11]*m.a[10] + @a[15]*m.a[11]
      @a[12] = @a[ 0]*m.a[12] + @a[ 4]*m.a[13] + @a[ 8]*m.a[14] + @a[12]*m.a[15]
      @a[13] = @a[ 1]*m.a[12] + @a[ 5]*m.a[13] + @a[ 9]*m.a[14] + @a[13]*m.a[15]
      @a[14] = @a[ 2]*m.a[12] + @a[ 6]*m.a[13] + @a[10]*m.a[14] + @a[14]*m.a[15]
      @a[15] = @a[ 3]*m.a[12] + @a[ 7]*m.a[13] + @a[11]*m.a[14] + @a[15]*m.a[15] 

    multiplyVec3: (v) ->
      x = @a[ 0]*v.x + @a[ 4]*v.y + @a[ 8]*v.z + @a[12]
      y = @a[ 1]*v.x + @a[ 5]*v.y + @a[ 9]*v.z + @a[13]
      z = @a[ 2]*v.x + @a[ 6]*v.y + @a[10]*v.z + @a[14]
      w = @a[ 3]*v.x + @a[ 7]*v.y + @a[11]*v.z + @a[15] 
      new Vec3 x/w y/w z/w

    multiplyVec4: (v) ->
      x = @a[ 0]*v.x + @a[ 4]*v.y + @a[ 8]*v.z + @a[12] * v.w
      y = @a[ 1]*v.x + @a[ 5]*v.y + @a[ 9]*v.z + @a[13] * v.w
      z = @a[ 2]*v.x + @a[ 6]*v.y + @a[10]*v.z + @a[14] * v.w
      w = @a[ 3]*v.x + @a[ 7]*v.y + @a[11]*v.z + @a[15] * v.w
      new Vec4 x y z w 

    at: (r,c) ->
      @a[c * Matrix4.DIM + r]

    getCol: (c)->
      c = c * Matrix4.DIM
      Vec4 @a[c + 0] @a[c + 1] @a[c + 2] @a[c + 3]

    getRow: (r) ->
      Vec4 @a[r + 0] @a[r + 4] @a[r + 8] @a[r + 12]




/ augment Sylvester some
Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw "Invalid length for Translation";
}

Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length == 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
}

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4)
        return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function ()
{
    return this.elements;
};

function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}

//
// gluLookAt
//
function makeLookAt(ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz)
{
    var eye = $V([ex, ey, ez]);
    var center = $V([cx, cy, cz]);
    var up = $V([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]]);

    var t = $M([[1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]]);
    return m.x(t);
}

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}

//
// glOrtho
//
function makeOrtho(left, right, bottom, top, znear, zfar)
{
    var tx = - (right + left) / (right - left);
    var ty = - (top + bottom) / (top - bottom);
    var tz = - (zfar + znear) / (zfar - znear);

    return $M([[2 / (right - left), 0, 0, tx],
           [0, 2 / (top - bottom), 0, ty],
           [0, 0, -2 / (zfar - znear), tz],
           [0, 0, 0, 1]]);
}


      
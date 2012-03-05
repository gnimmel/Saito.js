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
    for name in ['add', 'subtract', 'multiply', 'divide', 'normalize']
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

    toNormal: ->
      m = @length
      @divide m if m > 0

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
    for name in ['add', 'subtract', 'multiply', 'divide', 'normalize']
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

    toNormal: ->
      m = @length
      @divide m if m > 0

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
    for name in ['add', 'subtract', 'multiply', 'divide', 'normalize']
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

    toNormal: ->
      m = @length
      @divide m if m > 0

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
    for name in ['add', 'subtract', 'multiply', 'divide', 'addScalar', 'subtractScalar', 'multiplyScalar', 'divideScalar', 'translate']
    	do (name) ->
    	  Matrix4[name] = (a,b) ->
          a.copy()[name](b)

    Matrix4.DIM = 4

    # Take a list in column major format
    constructor: (@a=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) ->
      # todo - add checking

    dup : () ->
      new Matrix4(@a)

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

    multiply : (m) ->
      toMultiply m

    toMultiply: (m) ->
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


    inverse: () ->


    transpose: () ->
      new Matrix4( [ @a[0],@a[4],@a[8],@a[12],@a[1],@a[5],@a[9],@a[13],@a[2],@a[6],@a[10],@a[14],@a[3],@a[7],@a[11],@a[15] ] )

    translate: (v) ->
      if v.DIM == 3 or v.DIM == 4
        @a[12] += v.x
        @a[13] += v.y
        @a[14] += v.z

      else
        console.log "CoffeeGL Error - Mismatched vector and matrix dimensions"

    print: ()->
      console.log a[0] + "," + a[4] + "," + a[8] + "," + a[12]
      console.log a[1] + "," + a[5] + "," + a[9] + "," + a[13]
      console.log a[2] + "," + a[6] + "," + a[10] + "," + a[14]
      console.log a[3] + "," + a[7] + "," + a[11] + "," + a[15]

    lookAt: (eye,look,up) ->
      z = eye.subtract().toNormal()
      x = up.cross(z).toNormal()
      y = z.cross(x).toNormal()

      m = new Matrix4([x.x,x.y, x.z,0,y.x,y.y,y.z,0,z.x,z.y,z.z,0,0,0,0,1])
      t = new Matrix4([1,0,0,-eye.x,0,1,0,-eye.y,0,0,1,-eye.z,0,0,0,1])

      m.multiply(t)

    makePerspective: (fovy,aspect,znear,zfar) ->
      ymax = znear * Math.tan(fovy * Math.PI / 360.0)
      ymin = -ymax;
      xmin = ymin * aspect
      xmax = ymax * aspect
      makeFrustum(xmin, xmax, ymin, ymax, znear, zfar)

    makeFrustum: (left, right,bottom, top, znear, zfar) ->
      x = 2*znear/(right-left)
      y = 2*znear/(top-bottom)
      a = (right+left)/(right-left)
      b = (top+bottom)/(top-bottom)
      c = -(zfar+znear)/(zfar-znear)
      d = -2*zfar*znear/(zfar-znear)
      new Matrix4([x,0,0,0,0,y,0,0,a,b,c,-1,0,0,d,0])

    makeOrtho: (left, right, bottom, top, znear, zfar) ->
      tx = - (right + left) / (right - left)
      ty = - (top + bottom) / (top - bottom)
      tz = - (zfar + znear) / (zfar - znear)
      new Matrix4([2 / (right - left),0,0,tx,0, 2 / (top - bottom),0,ty,0,0, -2 / (zfar - znear),tz,0,0,0,1])

  exports.radToDeg = (a) ->
    a * 57.2957795

  exports.degToRad = (a) ->
    a * 0.017453292523928

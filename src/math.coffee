# Based largely on Cinder - libcinder.org &
# https://github.com/hornairs/blog/blob/master/assets/coffeescripts/flocking/vector.coffee


class Vec3
  # Class methods for nondestructively operating
  for name in ['add', 'subtract', 'multiply', 'divide']
  	do (name) ->
  	  Vec3[name] = (a,b) ->
        a.copy()[name](b)

  constructor: (x=0,y=0,z=0) ->
  	[@x,@y,@z] = [x,y,z]


class Vec4

# Class methods for nondestructively operating
  for name in ['add', 'subtract', 'multiply', 'divide']
  	do (name) ->
  	  Vec4[name] = (a,b) ->
        a.copy()[name](b)

  constructor: (x=0,y=0,z=0,w=1) ->
  	[@x,@y,@z,@w] = [x,y,z,w]

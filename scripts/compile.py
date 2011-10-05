#!/usr/bin/python

# A simple Python script to optimise saito.js

# Need to compress ALL javascript files and the embedded stuff in one
# Potentially pull in shaders as well

import httplib, urllib

f = open('../js/saito.js')
saitocode = f.read()
f.close

params = urllib.urlencode({
  'js_code' : saitocode.__str__(),
  'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
  'output_info' : 'compiled_code'
})


headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}

conn = httplib.HTTPConnection("closure-compiler.appspot.com")

conn.request("POST", "/compile",
             params, headers)

response = conn.getresponse()
#print response.status, response.reason
data = response.read()
print data
conn.close()

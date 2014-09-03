var shaders = {

      "copy-vs" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",

                  "void main(void) {",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                  "}"
            ]
      },


      "copy-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",

                  "void main(void) {",
                        "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                  "}"
            ]
      },


      "line-vs" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec4 aVertexColor;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",
                  "varying vec4 vVertexColor;",

                  "void main(void) {",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                        "vVertexColor = aVertexColor;",
                  "}"
            ]
      },


      "line-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "varying vec4 vVertexColor;",
                  "uniform sampler2D uSampler0;",

                  "void main(void) {",
                        "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                        "gl_FragColor = vVertexColor;",
                  "}"
            ]
      },


      "line-globe-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "varying vec4 vVertexColor;",
                  "uniform float globeAlpha;",
                  "uniform sampler2D uSampler0;",

                  "void main(void) {",
                        "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                        "gl_FragColor = vVertexColor;",
                        "gl_FragColor.a *= globeAlpha;",
                  "}"
            ]
      },

      "shader-vs" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec2 aUVOffset;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",
                  "varying vec2 vUVOffset;",

                  "void main(void) {",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                        "vUVOffset = aUVOffset;",
                  "}"
            ]
      },

      "facefront-vs" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec3 sizeOffset;",
                  "attribute vec2 aUVOffset;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",
                  "uniform mat3 invertCamera;",

                  "varying vec2 vTextureCoord;",
                  "varying vec2 vUVOffset;",
                  "varying float vAlpha;",
                  "varying vec4 V;",

                  "void main(void) {",
                        "vec3 size = vec3(sizeOffset.xy, 0.0);",
                        "vec3 adjustSize = size * invertCamera;",
                        "vec3 pos = aVertexPosition + adjustSize;",
                        "vec4 finalPos = uPMatrix * uMVMatrix * vec4(pos, 1.0);",
                        "gl_Position = finalPos;",
                        "V = finalPos;",
                        "vTextureCoord = aTextureCoord;",
                        "vUVOffset = aUVOffset;",
                        "vAlpha = sizeOffset.z;",
                  "}"
            ]
      },


      "particle-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "varying vec2 vUVOffset;",
                  "varying float vAlpha;",
                  "varying vec4 V;",

                  "float map(float value, float sx, float sy, float tx, float ty) {",
                        "float p = (value-sx) / (sy-sx);",
                        "if(p < 0.0) p = 0.0;",
                        "if(p>1.0) p = 1.0;",
                        "return p * ( ty - tx) + tx;",
                  "}",

                  "void main(void) {",
                        "vec2 offset = vUVOffset;",
                        "vec2 uv = offset + vTextureCoord*.25;",
                        "gl_FragColor = texture2D(uSampler0, uv);",
                        // "gl_FragColor.r /= gl_FragColor.a;",
                        // "gl_FragColor.g /= gl_FragColor.a;",
                        // "gl_FragColor.b /= gl_FragColor.a;",
                        // "float alphaOffset = (1.0 - V.z/4000.0) * 1.0 + .0;",
                        // "float alphaOffset = map(V.z, 3000.0, 1000.0, 0.0, 1.0);",
                        "float alphaOffset = 1.0;",
                        "gl_FragColor.a *= vAlpha * alphaOffset;",
                  "}"
            ]
      },


      "particle-fs-globe" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                   "uniform float globeAlpha;",

                  "varying vec2 vUVOffset;",
                  "varying float vAlpha;",
                  "varying vec4 V;",

                  "float map(float value, float sx, float sy, float tx, float ty) {",
                        "float p = (value-sx) / (sy-sx);",
                        "if(p < 0.0) p = 0.0;",
                        "if(p>1.0) p = 1.0;",
                        "return p * ( ty - tx) + tx;",
                  "}",

                  "void main(void) {",
                        "vec2 offset = vUVOffset;",
                        "vec2 uv = offset + vTextureCoord*.25;",
                        "gl_FragColor = texture2D(uSampler0, uv);",
                        "gl_FragColor.r /= gl_FragColor.a;",
                        "gl_FragColor.g /= gl_FragColor.a;",
                        "gl_FragColor.b /= gl_FragColor.a;",
                        // "float alphaOffset = (1.0 - V.z/4000.0) * 1.0 + .0;",
                        // "float alphaOffset = map(V.z, 3000.0, 1000.0, 0.0, 1.0);",
                        "gl_FragColor.a *= vAlpha * globeAlpha;",
                  "}"
            ]
      },


      "shader-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "varying vec2 vUVOffset;",

                  "void main(void) {",
                        "vec2 offset = vUVOffset;",
                        "vec2 uv = offset + vTextureCoord*.25;",
                        "gl_FragColor = texture2D(uSampler0, uv);",
                        "gl_FragColor.r /= gl_FragColor.a;",
                        "gl_FragColor.g /= gl_FragColor.a;",
                        "gl_FragColor.b /= gl_FragColor.a;",
                  "}"
            ]
      },


      "picking-vs" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec2 sizeOffset;",
                  "attribute vec2 aUVOffset;",
                  "attribute vec3 aVertexColor;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",
                  "uniform mat3 invertCamera;",

                  "varying vec2 vTextureCoord;",
                  "varying vec2 vUVOffset;",
                  "varying vec3 vVertexColor;",

                  "void main(void) {",
                        "vec3 size = vec3(sizeOffset, 0.0);",
                        "vec3 adjustSize = size * invertCamera;",
                        "vec3 pos = aVertexPosition + adjustSize;",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                        "vVertexColor = aVertexColor;",
                        "vUVOffset = aUVOffset;",
                  "}"
            ]
      },


      "picking-fs" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision highp float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "varying vec2 vUVOffset;",
                  "varying vec3 vVertexColor;",

                  "void main(void) {",
                        "vec2 offset = vUVOffset;",
                        "vec2 uv = offset + vTextureCoord*.25;",
                        "gl_FragColor = texture2D(uSampler0, uv);",
                        "gl_FragColor.rgb = vVertexColor;",
                        "gl_FragColor.a = gl_FragColor.a == 0.0 ? 0.0 : 1.0;",
                  "}"
            ]
      }


};



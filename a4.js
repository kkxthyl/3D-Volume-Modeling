import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

const quad = {

  normals:[
    /*Front face*/
    0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,

    /*Back face*/
    0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,

    /*Top face*/
    0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,  0, 1, 0,
    
    /*Bottom face*/
    0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,
  
    /*Right face*/
    1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,
  
    /*Left face*/
    -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0
  ],
  
  positions:[
    // b: top, r: top, g: front                       6
    -1, -1,  1,
    1, -1,  1,
    1,  1,  1,
    -1, -1,  1,
    1,  1,  1,
    -1,  1,  1,

    //b: bottom, r: bottom, g: back                   1
    -1, -1, -1,
    1,  1, -1,
    -1,  1, -1,

    -1, -1, -1,
    1,  1, -1,
    1, -1, -1,

    //b: right back, r: right, g: top                   4
    -1,  1, -1,
    -1,  1,  1,
    1,  1,  1,
    -1,  1, -1,
    1,  1,  1,
    1,  1, -1,


    // b: left, r: back left, g: bottom                 3
    -1, -1, -1,
    1, -1, -1,
    1, -1,  1,
    -1, -1, -1,
    1, -1,  1,
    -1, -1,  1,

    // b: right, r: left, g: right                      2
    1, -1,  1,
    1,  1, -1,
    1,  1,  1,

    1,  1, -1,
    1, -1, -1,
    1, -1,  1,


    // b: left back, r: right back, g: left             5
    -1, -1, -1,
    -1, -1,  1,
    -1,  1,  1,
    -1, -1, -1,
    -1,  1,  1,
    -1,  1, -1
  ],

  uvCoords: [
    //1
    0, 2/3,  
    1/2, 2/3,
    1/2, 1,
  
    1/2, 2/3,  
    0, 1, 
    0, 2/3,

    //6
    1, 1/3, 
    1/2, 0, 
    1/2, 1/3, 

    1, 0,  
    1/2, 1/3,
    1, 1/3, 

    //3
    1/2, 0, 
    0, 0, 
    0, 1/3, 

    1/2, 0, 
    0, 1/3, 
    1/2, 1/3,

    //4
    1/2, 2/3, 
    1/2, 1,
    1, 1, 

    1, 2/3, 
    1/2, 1,
    1, 1,

    //2
    0, 1/3, 
    1/2, 2/3,   
    1/2, 1/3, 

    1/2, 2/3, 
    0, 2/3,
    0, 1/3, 

    //5
    1/2, 1/3, 
    1/2, 2/3,   
    1, 2/3, 

    1, 2/3,
    1/2, 1/3, 
    1/2, 2/3,  
  ]
}

TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = quad.positions;
  this.normals = quad.normals;
  this.uvCoords = quad.uvCoords;
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  let vertices = []; 
  let normals = []; 
  let textCoords = []; 

  let radius = 1; 
  let lengthInv = 1.0/radius; 

  let sectorStep = -2 * Math.PI / numSectors; 

  console.log(sectorStep);
  let stackStep = Math.PI / numStacks; 
  
  for (let i = numStacks; i >= 0; --i){
    let stackAngle = Math.PI / 2 - i * stackStep; 
    let xy = radius * Math.cos(stackAngle); 
    let z = radius * Math.sin(stackAngle); 

    for (let j = numSectors; j >=0; --j){
      let sectorAngle = j * sectorStep; 
      //vertex postiion
      let x = xy * Math.cos(sectorAngle); 
      let y = xy * Math.sin(sectorAngle); 
      vertices.push(x); 
      vertices.push(y); 
      vertices.push(z); 

      //normalized vertex normal
      let nx = x * lengthInv; 
      let ny = y * lengthInv; 
      let nz = z * lengthInv; 
      normals.push(nx); 
      normals.push(ny); 
      normals.push(nz); 

      let s = j/numSectors; 
      let t = i/numStacks; 
      textCoords.push(s); 
      textCoords.push(t); 

    }
  }

  let indices = []; 
  for (let i = 0; i < numStacks; i++){
    let k1 = i * (numSectors + 1); 
    let k2 = k1 + numSectors + 1; 

    for (let j = 0; j < numSectors; ++j, ++k1, ++k2){
      if (i != 0){
        indices.push(k1); 
        indices.push(k2); 
        indices.push(k1 + 1); 
      }

      if (i != (numStacks-1)){
        indices.push(k1 + 1); 
        indices.push(k2); 
        indices.push(k2 + 1); 
      }
    }

  }
  this.positions = vertices; 
  this.normals = normals; 
  this.uvCoords = textCoords;
  this.indices = indices; 
}


Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  console.log(transformSequence);

  for (let i = 0; i < transformSequence.length; i++){

    if (transformSequence[i][0] == 'S'){
      let scale = Mat4.create();
      Mat4.set(scale, 
        transformSequence[i][1], 0, 0, 
        0, 0, transformSequence[i][2], 0, 0, 
        0, 0, transformSequence[i][3], 0, 
        0, 0, 0, 1);
      
      Mat4.multiply(overallTransform,scale, overallTransform);
      console.log("SCALE", scale);
    }

    else if (transformSequence[i][0] == 'Rx'){
      let rotateX = Mat4.create(); 
      let theta = transformSequence[i][1]*(Math.PI/180); 

      Mat4.set(rotateX, 
        1, 0, 0, 0, 
        0, Math.cos(theta), Math.sin(theta), 0, 
        0, -Math.sin(theta), Math.cos(theta), 0, 
        0, 0, 0, 1);
      
      Mat4.multiply(overallTransform, rotateX, overallTransform);
      console.log("ROTATE X", rotateX, theta);
    }

    else if (transformSequence[i][0] == 'Ry'){
      let rotateY = Mat4.create(); 
      let theta = transformSequence[i][1]*(Math.PI/180); 

      Mat4.set(rotateY, 
        Math.cos(theta), 0, -Math.sin(theta), 0, 
        0, 1, 0, 0, 
        Math.sin(theta), 0, Math.cos(theta), 0, 
        0, 0, 0, 1);
      
      Mat4.multiply(overallTransform, rotateY, overallTransform);
      console.log("ROTATE Y", rotateY, theta);
    }

    else if (transformSequence[i][0] == 'Rz'){
      let rotateZ = Mat4.create(); 
      let theta = transformSequence[i][1]*(Math.PI/180); 

      Mat4.set(rotateZ, 
        Math.cos(theta), (Math.sin(theta)), 0, 0, 
        -Math.sin(theta), Math.cos(theta), 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1);

      Mat4.multiply(overallTransform, rotateZ, overallTransform);
      console.log("overallTransform Z", overallTransform);
    }

    else if (transformSequence[i][0] == 'T'){
      let translate = Mat4.create(); 
      Mat4.set(translate, 
        1, 0, 0, 0, 
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        transformSequence[i][1], transformSequence[i][2], transformSequence[i][3], 1);
      
      Mat4.multiply(overallTransform, translate, overallTransform);
      console.log("TRANSFORM", overallTransform);
    }

  }

  return overallTransform;
}


Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
attribute vec3 position, normal;

attribute vec2 uvCoord;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 N; 
varying vec3 L; 
varying vec3 H; 
varying float d; 

void main() {

  N = normalize(normalMatrix * normal);
  L = normalize(lightPosition + position); 
  d = distance(normalize(normalMatrix * lightPosition), normalize(normalMatrix * position));
  H = normalize(L + (normalMatrix * position));

  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;

uniform sampler2D uTexture;   //texture sample
uniform bool hasTexture;   
varying vec2 vTexCoord;   //interpolated textute coordinates

// TODO: implement fragment shader logic below

varying vec3 N; 
varying vec3 L; 
varying vec3 H; 
varying float d; 

void main() {
  vec3 ca = ka * lightIntensity;
  vec3 cd = kd/(d*d) *  max(0.0, dot(L, N)) * lightIntensity; 
  vec3 cs = ks/(d*d) *  max(0.0, pow(dot(N, H), shininess)) * lightIntensity;

  if (hasTexture){
    gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(ca+cd+cs, 1.0); 
  } else {
    gl_FragColor = vec4(ca+cd+cs, 1.0);
  }
}
`;


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,blu2DiceMat,0,0.1,0.1,0,0.7,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "m,bballMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,basketball-01.png;",
  "m,tballMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,tennis-01.png;",


  "o,gl,unitSphere,globeMat;",
  
  "o,rd1,unitCube,redDiceMat;",
  "o,gd1,unitCube,grnDiceMat;",
  "o,bd1,unitCube,bluDiceMat;",
 
  "o,rd2,unitCube,redDiceMat;",
  "o,gd2,unitCube,grnDiceMat;",
  "o,bd2,unitCube,blu2DiceMat;",

  "o,bb,unitSphere,bballMat;",
  "o,te,unitSphere,tballMat;",

  "X,rd1,Rz,75;",
  "X,rd1,Rx,90;",
  "X,rd1,S,0.5,0.5,0.5;",
  "X,rd1,T,-1,0,2;",

  "X,gd1,Rz,75;",
  "X,gd1,Rx,90;",
  "X,gd1,S,0.5,0.5,0.5;",
  "X,gd1,T,-1,2,2;",
  
  "X,bd1,Rz,75;",
  "X,bd1,Rx,90;",
  "X,bd1,S,0.5,0.5,0.5;",
  "X,bd1,T,-1,1,2;",

  "X,rd2,Rz,75;",
  "X,rd2,Rx,90;",
  "X,rd2,S,0.5,0.5,0.5;",
  "X,rd2,T,-1,1,1;",

  "X,gd2,Rz,75;",
  "X,gd2,Rx,90;",
  "X,gd2,S,0.5,0.5,0.5;",
  "X,gd2,T,-1,0,0;",
  
  "X,bd2,Rz,75;",
  "X,bd2,Rx,90;",
  "X,bd2,S,0.5,0.5,0.5;",
  "X,bd2,T,-1,0,1;",

  "X,gl,S,1.3,1.3,1.3;", 
  "X,gl,Rx,90;", 
  "X,gl,Ry,-150;",
  "X,gl,T,0,-3,0;",

  "X,bb,S,1,1,1;", 
  "X,bb,Rx,90;", 
  "X,bb,Ry,-150;",
  "X,bb,T,2,1,0;",

  "X,te,S,0.6,0.6,0.6;", 
  "X,te,Rx,90;", 
  "X,te,Ry,-150;",
  "X,te,T,1,2.4,0;",

].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };

var canvas;
var gl;
var program;
var mouseDown = false;
var shader = true;
var stext = false;
var ptext = true;
var anime = true;

var mousePosition = {
	oldx:0,
	oldy:0,
	newx:0,
	newy:0
	};

var mapMode = 0;
var axis = 0;
var reset1 = [0, 0, 0];
var reset2 = [-32, 0, -32];
var dir = "left";

var eye = vec3(0.0, 8.1, 5.7);
var at = vec3(0.0, 0.0, -20.0);
var up = vec3(0.0, 1.0, 0.0);
var fovy = 90;

var lightPos = vec3(13.0, 15.0, 0.0);

var vertices = [];
var indices = [];
var planeIndicesLength = 0;

var heights = [];

var texture0;
var texture1;
var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var modelMatrixLoc;
var shaderLoc;
var textLoc;
var colorLoc;
var lightPosLoc;
var bodyRotateLoc;
var vPosition;
var vNormal;

var beasts = [];
var bob;
var bill;
var max;
var craig;

function scale( x, y, z )
{
    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;
    return result;
}

function Vertex(position, texCoord, normal)
{
    var vertex =  [
            //Offset = 0
            position[0], position[1], position[2], 
            // Offset = 3
            normal[0], normal[1], normal[2], 
            //Offset = 6
            texCoord[0], texCoord[1] 
            //Size = Offset = 8 
        ];

    return vertex;
}

function Animal(startDir) {
   this.bodyRotate = [0, 0, 0];
   this.cHier = 1;
   this.step = 1;
   this.direction = "left";
   this.bodyIndices = [];
   this.tpos = [];
   this.theta = [];
   this.build = function() {
      //body
      var vb = vertices.length;
      vertices.push(Vertex(vec3(-1.0, -0.25, 1.0), vec2(0,0), vec3(-1.0, -0.25, 1.0))); 
      vertices.push(Vertex(vec3(-1.0, 0.5, 1.0), vec2(0,0), vec3(-1.0, 0.5, 1.0)));
      vertices.push(Vertex(vec3(1.0, 0.5, 1.0), vec2(0,0), vec3(1.0, 0.5, 1.0)));
      vertices.push(Vertex(vec3(1.0, -0.25, 1.0), vec2(0,0), vec3(1.0, -0.25, 1.0)));
      vertices.push(Vertex(vec3(-1.0, -0.25, -1.0), vec2(0,0), vec3(-1.0, -0.25, -1.0)));
      vertices.push(Vertex(vec3(-1.0, 0.5, -1.0), vec2(0,0), vec3(-1.0, 0.5, -1.0)));
      vertices.push(Vertex(vec3(1.0, 0.5, -1.0), vec2(0,0), vec3(1.0, 0.5, -1.0)));
      vertices.push(Vertex(vec3(1.0, -0.25, -1.0), vec2(0,0), vec3(1.0, -0.25, -1.0)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36); 
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]); 
      //head
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.5, -0.25, 0.25), vec2(0,0), vec3(-1.5, -0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.5, 0.25, 0.25), vec2(0,0), vec3(-1.5, 0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.25, 0.25), vec2(0,0), vec3(-1.0, 0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.0, -0.25, 0.25), vec2(0,0), vec3(-1.0, -0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.5, -0.25, -0.25), vec2(0,0), vec3(-1.5, -0.25, -0.25)));
      vertices.push(Vertex(vec3(-1.5, 0.25, -0.25), vec2(0,0), vec3(-1.5, 0.25, -0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.25, -0.25), vec2(0,0), vec3(-1.0, 0.25, -0.25)));
      vertices.push(Vertex(vec3(-1.0, -0.25, -0.25), vec2(0,0), vec3(-1.0, -0.25, -0.25)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      //ears 
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.5, 0.0, 0.25), vec2(0,0), vec3(-1.5, 0.0, 0.25)));
      vertices.push(Vertex(vec3(-1.5, 0.25, 0.25), vec2(0,0), vec3(-1.5, 0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.25, 0.25), vec2(0,0), vec3(-1.0, 0.25, 0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.0, 0.25), vec2(0,0), vec3(-1.0, 0.0, 0.25)));
      vertices.push(Vertex(vec3(-1.25, 0.125, 0.60), vec2(0,0), vec3(-1.25, 0.125, 0.60)));
      indices.push(0 + vb, 1 + vb, 4 + vb, 1 + vb, 2 + vb, 4 + vb);
      indices.push(2 + vb, 3 + vb, 4 + vb, 3 + vb, 0 + vb, 4 + vb);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.5, 0.0, -0.25), vec2(0,0), vec3(-1.5, 0.0, -0.25)));
      vertices.push(Vertex(vec3(-1.5, 0.25, -0.25), vec2(0,0), vec3(-1.5, 0.25, -0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.25, -0.25), vec2(0,0), vec3(-1.0, 0.25, -0.25)));
      vertices.push(Vertex(vec3(-1.0, 0.0, -0.25), vec2(0,0), vec3(-1.0, 0.0, -0.25)));
      vertices.push(Vertex(vec3(-1.25, 0.125, -0.60), vec2(0,0), vec3(-1.25, 0.125, -0.60)));
      indices.push(0 + vb, 1 + vb, 4 + vb, 1 + vb, 2 + vb, 4 + vb);
      indices.push(2 + vb, 3 + vb, 4 + vb, 3 + vb, 0 + vb, 4 + vb);
      this.bodyIndices.push(24);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      //eyes
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.6, 0.2, 0.2), vec2(0,0), vec3(-1.6, 0.2, 0.2)));
      vertices.push(Vertex(vec3(-1.6, 0.2, 0.1), vec2(0,0), vec3(-1.6, 0.2, 0.1)));
      vertices.push(Vertex(vec3(-1.6, 0.1, 0.1), vec2(0,0), vec3(-1.6, 0.1, 0.1)));
      vertices.push(Vertex(vec3(-1.6, 0.1, 0.2), vec2(0,0), vec3(-1.6, 0.1, 0.2)));
      vertices.push(Vertex(vec3(-1.25, 0.125, 0.0), vec2(0,0), vec3(-1.25, 0.125, 0.0)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 4 + vb, 1 + vb, 3 + vb, 4 + vb);
      indices.push(2 + vb, 3 + vb, 4 + vb, 2 + vb, 0 + vb, 4 + vb);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.6, 0.2, -0.2), vec2(0,0), vec3(-1.6, 0.2, -0.2)));
      vertices.push(Vertex(vec3(-1.6, 0.2, -0.1), vec2(0,0), vec3(-1.6, 0.2, -0.1)));
      vertices.push(Vertex(vec3(-1.6, 0.1, -0.1), vec2(0,0), vec3(-1.6, 0.1, -0.1)));
      vertices.push(Vertex(vec3(-1.6, 0.1, -0.2), vec2(0,0), vec3(-1.6, 0.1, -0.2)));
      vertices.push(Vertex(vec3(-1.25, 0.125, 0.0), vec2(0,0), vec3(-1.25, 0.125, 0.0)))
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 4 + vb, 1 + vb, 3 + vb, 4 + vb);
      indices.push(2 + vb, 3 + vb, 4 + vb, 2 + vb, 0 + vb, 4 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      //mouth
      vb = vertices.length;
      vertices.push(Vertex(vec3(-1.55, -0.1, 0.2), vec2(0,0), vec3(-1.55, -0.1, 0.2)));
      vertices.push(Vertex(vec3(-1.5, -0.1, 0.2), vec2(0,0), vec3(-1.5, -0.1, 0.2)));
      vertices.push(Vertex(vec3(-1.55, -0.15, 0.0), vec2(0,0), vec3(-1.55, -0.15, 0.0)));
      vertices.push(Vertex(vec3(-1.5, -0.15, 0.0), vec2(0,0), vec3(-1.5, -0.15, 0.0)));
      vertices.push(Vertex(vec3(-1.55, -0.1, -0.2), vec2(0,0), vec3(-1.55, -0.1, -0.2)));
      vertices.push(Vertex(vec3(-1.5, -0.1, -0.2), vec2(0,0), vec3(-1.5, -0.1, -0.2)));
      indices.push(0 + vb, 1 + vb, 3 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 4 + vb, 1 + vb, 4 + vb, 5 + vb);
      indices.push(2 + vb, 4 + vb, 5 + vb, 2 + vb, 3 + vb, 5 + vb);
      indices.push(0 + vb, 2 + vb, 4 + vb);
      this.bodyIndices.push(21);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      //leg hierarchy1
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      //leg hierarchy2
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
      vb = vertices.length;
      vertices.push(Vertex(vec3(-.125, -1, .125), vec2(0,0), vec3(-.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, 0, .125), vec2(0,0), vec3(-.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, 0, .125), vec2(0,0), vec3(.125, 0, .125)));
      vertices.push(Vertex(vec3(.125, -1, .125), vec2(0,0), vec3(.125, -1, .125)));
      vertices.push(Vertex(vec3(-.125, -1, -.125), vec2(0,0), vec3(-.125, -1, -.125)));
      vertices.push(Vertex(vec3(-.125, 0, -.125), vec2(0,0), vec3(-.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, 0, -.125), vec2(0,0), vec3(.125, 0, -.125)));
      vertices.push(Vertex(vec3(.125, -1, -.125), vec2(0,0), vec3(.125, -1, -.125)));
      indices.push(0 + vb, 1 + vb, 2 + vb, 0 + vb, 2 + vb, 3 + vb);
      indices.push(0 + vb, 1 + vb, 5 + vb, 0 + vb, 5 + vb, 4 + vb);
      indices.push(0 + vb, 4 + vb, 7 + vb, 0 + vb, 7 + vb, 3 + vb);
      indices.push(3 + vb, 2 + vb, 6 + vb, 3 + vb, 6 + vb, 7 + vb);
      indices.push(1 + vb, 5 + vb, 6 + vb, 1 + vb, 6 + vb, 2 + vb);
      indices.push(5 + vb, 6 + vb, 4 + vb, 6 + vb, 4 + vb, 7 + vb);
      this.bodyIndices.push(36);
      this.tpos.push([0, 0, 0]);
      this.theta.push([0, 0, 0]);
   };
   this.randomDirection = function() {
      var random = Math.floor(Math.random() * 100);
      if(random < 25) {
         var diRandom = Math.floor(Math.random() * 4);
         switch(diRandom) {
            case 0:
                  this.direction = "left";
                  break;
            case 1:
                  this.direction = "right";
                  break;
            case 2:
                  this.direction = "front";
                  break;
            case 3:
                  this.direction = "back";
                  break;
         }
      }
   }
   this.setDir = function(bodyPart) {
      switch(this.direction) {
         case "left":
                     this.theta[bodyPart] = [0, 0, 0];
                     break;
         case "right":
                     this.theta[bodyPart] = [0, 180, 0];
                     break;
         case "front":
                     this.theta[bodyPart] = [0, 270, 0];
                     break;
         case "back":
                     this.theta[bodyPart] = [0, 90, 0];
                     break; 
      }
   };
   this.moveFirst = function() {
      switch(this.cHier) {
         case 1:
               this.hierConstruct(2);
               this.cHier = 2;
               break;
         case 2:
               this.hierConstruct(1);
               this.cHier = 1;
               break;
         case 3:
               this.hierConstruct(4);
               this.cHier = 4;
               break;
         case 4:
               this.hierConstruct(3);
               this.cHier = 3;
               break;
      }
   };
   this.moveSecond = function() {
      switch(this.cHier) {
         case 1:
               this.hierConstruct(3);
               this.cHier = 3;
               break;
         case 2:
               this.hierConstruct(4);
               this.cHier = 4;
               break;
         case 3:
               this.hierConstruct(1);
               this.cHier = 1;
               break;
         case 4:
               this.hierConstruct(2);
               this.cHier = 2;
               break;
      }
   };
   this.hierConstruct = function(hierCode) {
      if(hierCode == 1) {
         for(var i = 0; i < this.bodyIndices.length; ++i) {
            switch(i) {
                case 0: case 1: case 2: case 3: case 4:
                      this.tpos[i] = [0, getHeight(0, 0) + 1.5, 0];
                      break;
                case 5:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 5, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 6:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 6, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 7:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 7, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 8:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 8, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 9:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 9, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 10:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 10, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 11:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 11, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 12:
                      this.theta[i] = [0,0,0];
                      this.tpos[i] = bodyOffset(this.direction, 12, 1);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
            }
         }
      } 
      if(hierCode == 2) {
          for(var i = 0; i < this.bodyIndices.length; ++i) {
             switch(i) {
                case 0: case 1: case 2: case 3: case 4:
                      this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                      break;
                case 5:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 5, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 6:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 6, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 7:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 7, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 8:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 8, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 9:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 9, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 10:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 10, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 11:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 11, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 12:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 12, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
             }
          }
      }
      if(hierCode == 3) {
          for(var i = 0; i < this.bodyIndices.length; ++i) {
             switch(i) {
                case 0: case 1: case 2: case 3: case 4:
                      this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                      break;
                 case 5:
                   this.theta[i] = [0,0,0];
                   this.tpos[i] = bodyOffset(this.direction, 5, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 6:
                   this.theta[i] = [0,0,0];
                   this.tpos[i] = bodyOffset(this.direction, 6, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 7:
                   this.theta[i] = [0,0,0];
                   this.tpos[i] = bodyOffset(this.direction, 7, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 8:
                   this.theta[i] = [0,0,0];
                   this.tpos[i] = bodyOffset(this.direction, 8, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 9:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 9, 4);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 10:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 10, 4);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 11:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 11, 4);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 12:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 12, 4);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             }
          }
      }
      if(hierCode == 4) {
          for(var i = 0; i < this.bodyIndices.length; ++i) {
             switch(i) {
                case 0: case 1: case 2: case 3: case 4:
                      this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                      break;
                 case 5:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 5, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 6:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 6, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 7:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 7, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 8:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 8, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 9:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 9, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 10:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 10, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 11:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 11, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 12:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 12, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             }
          }
      }
   };
   this.move = function(i) {
      this.bodyRotate = [0, 0, 0];
      switch(this.direction) {
         case "left":
                    var deg = calculateTheta(getHeight(this.tpos[0][0] - 1, this.tpos[0][2]), getHeight(this.tpos[0][0], this.tpos[0][2]));
                    this.bodyRotate = [0, 0, -deg];
                    break;             
         case "right":
                    var deg = calculateTheta(getHeight(this.tpos[0][0] + 1, this.tpos[0][2]), getHeight(this.tpos[0][0], this.tpos[0][2]));
                    this.bodyRotate = [0, 0, deg]
                    break;
         case "front":
                    var deg = calculateTheta(getHeight(this.tpos[0][0], this.tpos[0][2] ), getHeight(this.tpos[0][0], this.tpos[0][2] - 1));
                    this.bodyRotate = [-deg, 0, 0]
                    break;
         case "back": 
                    var deg = calculateTheta(getHeight(this.tpos[0][0], this.tpos[0][2] ), getHeight(this.tpos[0][0], this.tpos[0][2] + 1));
                    this.bodyRotate = [deg, 0, 0]
                    break;
      }
      if(this.step == 4) this.step = 1;
      if(this.step == 1) {
          switch(i) {
             case 0: case 1: case 2: case 3: case 4:
                   this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                   break;
             case 5:
                   this.tpos[i] = bodyOffset(this.direction, 5, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 6:
                   this.tpos[i] = bodyOffset(this.direction, 6, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 7:
                   this.tpos[i] = bodyOffset(this.direction, 7, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 8:
                   this.tpos[i] = bodyOffset(this.direction, 8, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 9:
                   this.tpos[i] = bodyOffset(this.direction, 9, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 10:
                   this.tpos[i] = bodyOffset(this.direction, 10, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 11:
                   this.tpos[i] = bodyOffset(this.direction, 11, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 12:
                   this.tpos[i] = bodyOffset(this.direction, 12, 1);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break; 
          }
      }
      if(this.step == 2) {
          switch(i) {
             case 0: case 1: case 2: case 3: case 4:
                   this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                   break;
                   this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                   break;
             case 5:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 5, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 6:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 6, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 7:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 7, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 8:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 8, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 9:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 9, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 10:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 10, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 11:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 11, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
                case 12:
                      this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                      this.tpos[i] = bodyOffset(this.direction, 12, 2);
                      this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                      break;
         }
      }
      if(this.step == 3) {
          switch(i) {
             case 0: case 1: case 2: case 3: case 4:
                   switch(this.direction) {
                      case "left":
                             this.tpos[i] = [this.tpos[i][0]-1, getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                             break;
                      case "right":
                             this.tpos[i] = [this.tpos[i][0]+1, getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                             break;
                      case "front":
                             this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]-1];
                             break;
                      case "back":
                             this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]+1];
                             break;
                   }
                   this.tpos[i] = [this.tpos[i][0], getHeight(this.tpos[i][0], this.tpos[i][2]) + 1.5, this.tpos[i][2]];
                   break;
             case 5:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 5, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 6:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 6, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 7:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 7, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 8:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 45);
                   this.tpos[i] = bodyOffset(this.direction, 8, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 9:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 9, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 10:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 10, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 11:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 11, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
             case 12:
                   this.theta[i] = determineRotation(this.theta[i], this.direction, 90);
                   this.tpos[i] = bodyOffset(this.direction, 12, 3);
                   this.tpos[i] = locationOffset(this.tpos[i], this.tpos[0]);
                   break;
          }
      }
      if(i == 12) ++this.step;
   };
   var determineRotation = function(curRot, direction, degree) {
      var result = [0, 0, 0];
      switch(direction) {
         case "left":
                     result = [0, 0, degree];
                     break;
         case "right":
                     result = [0, 0, -degree];
                     break;
         case "front":
                     result = [-degree, 0, 0];
                     break;
         case "back":
                     result = [degree, 0, 0];
                     break;
      }
      return result;
   };
   var bodyOffset = function(direction, i, step) {
      var result = [0, 0, 0];
      switch(i) {
         case 5:
               switch(direction) {
                  case "left":
                             result = [-.875, -.25, .875];
                             break;
                  case "right":
                             result = [.875, -.25, -.875];
                             break;
                  case "front":
                             result = [-.875, -.25, -.875];
                             break;
                  case "back":
                             result = [-.875, -.25, .875];
                             break;
               }
               break;
         
         case 6:
               switch(direction) {
                  case "left":
                             result = [-.875, -.25, -.875];
                             break;
                  case "right":
                             result = [.875, -.25, .875];
                             break;
                  case "front":
                             result = [.875, -.25, -.875];
                             break;
                  case "back":
                             result = [.875, -.25, .875];
                             break;
               }
               break;
         
         case 7:
               switch(direction) {
                  case "left":
                             result = [.875, -.25, .875];
                             break;
                  case "right":
                             result = [-.875, -.25, -.875];
                             break;
                  case "front":
                             result = [-.875, -.25, .875];
                             break;
                  case "back":
                             result = [.875, -.25, -.875];
                             break;
               }
               break;
         case 8:
               switch(direction) {
                  case "left":
                             result = [.875, -.25, -.875];
                             break;
                  case "right":
                             result = [-.875, -.25, .875];
                             break;
                  case "front":
                             result = [.875, -.25, .875];
                             break;
                  case "back":
                             result = [-.875, -.25, -.875];
                             break;
               }
               break;
         case 9:
               switch(direction) {
                  case "left":
                             result = [-.875, -1, .875];
                             break;
                  case "right":
                             result = [.875, -1, -.875];
                             break;
                  case "front":
                             result = [-.875, -1, -.875];
                             break;
                  case "back":
                             result = [.875, -1, .875];
                             break;
               }
               break;
         case 10:
               switch(direction) {
                  case "left":
                             result = [-.875, -1, -.875];
                             break;
                  case "right":
                             result = [.875, -1, .875];
                             break;
                  case "front":
                             result = [.875, -1, -.875];
                             break;
                  case "back":
                             result = [-.875, -1, .875];
                             break;
               }
               break;
         case 11:
               switch(direction) {
                  case "left":
                             result = [.875, -1, .875];
                             break;
                  case "right":
                             result = [-.875, -1, -.875];
                             break;
                  case "front":
                             result = [-.875, -1, .875];
                             break;
                  case "back":
                             result = [.875, -1, -.875];
                             break;
               }
               break;
         case 12:
               switch(direction) {
                  case "left":
                             result = [.875, -1, -.875];
                             break;
                  case "right":
                             result = [-.875, -1, .875];
                             break;
                  case "front":
                             result = [.875, -1, .875];
                             break;
                  case "back":
                             result = [-.875, -1, -.875];
                             break;
               }
               break;
      }
      if( 13 > i && i > 8) {
         switch(step) {
            case 1:
                  break;
            case 2: case 3:
                  switch(direction) {
                     case "left":
                                result = [result[0] + .53, result[1] + .22, result[2]];
                                break;
                     case "right":
                                result = [result[0] - .53, result[1] + .22, result[2]];
                                break;
                     case "front":
                                result = [result[0], result[1] + .22, result[2] + .53];
                                break;
                     case "back":
                                result = [result[0], result[1] + .22, result[2] - .53];
                                break;
                  }
                  break;
            case 4:
                  switch(direction) {
                     case "left":
                                result = [result[0] - .125, result[1] - .125, result[2]];
                                break;
                     case "right":
                                result = [result[0] + .125, result[1] - .125, result[2]];
                                break;
                     case "front":
                                result = [result[0], result[1] - .125, result[2] - .125];
                                break;
                     case "back":
                                result = [result[0], result[1] - .125, result[2] + .125];
                                break;
                  }
                  break;
         }
      }
      return result;
   };
   var locationOffset = function(i, j) {
      var result = [i[0] + j[0], i[1] + j[1], i[2] + j[2]];
      return result;
   };
   var calculateTheta = function(i, j) {
      var deg = (Math.atan((i-j)/2) * 180)/Math.PI;
      if(deg > 10) deg = 5;
      if(deg < -10) deg = -5;
      return deg;
   };
}
//Hard coded offsets and size because javascript doesn't have c style structs and sizeof operator
Vertex.offsetPosition = 0 * Float32Array.BYTES_PER_ELEMENT;
Vertex.offsetNormal = 3 * Float32Array.BYTES_PER_ELEMENT;
Vertex.offsetTexCoord = 6 * Float32Array.BYTES_PER_ELEMENT;
Vertex.size = 8 * Float32Array.BYTES_PER_ELEMENT;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
	
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mouseout", doMouseOut, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    // enable hidden-surface removal
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    heights = setHeights();	
    GeneratePlane();
    //GenerateSphere();
    
    bob = new Animal("left");
    bob.build();
    
    bill = new Animal("right");
    bill.build();
    max = new Animal("front");
    max.build();
    craig = new Animal("back");
    craig.build();
    beasts.push(bob, bill, max, craig);
	
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	
    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 3, gl.FLOAT, false, Vertex.size, Vertex.offsetPosition);
    gl.enableVertexAttribArray( aPosition );

    var aTextureCoord = gl.getAttribLocation( program, "aTextureCoord" );
    gl.vertexAttribPointer( aTextureCoord, 2, gl.FLOAT, false, Vertex.size, Vertex.offsetTexCoord);
    gl.enableVertexAttribArray( aTextureCoord );


    var aNormal = gl.getAttribLocation( program, "aNormal" );
    gl.vertexAttribPointer( aNormal, 3, gl.FLOAT, false, Vertex.size, Vertex.offsetNormal );
    gl.enableVertexAttribArray( aNormal );
	
	generateSText('earth.jpg');

    	generatePText("Checker.png");

	projectionMatrixLoc = gl.getUniformLocation(program, "Projection");
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelView");
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	shaderLoc = gl.getUniformLocation(program, "shader");
	lightPosLoc = gl.getUniformLocation(program, "lightPos");
	textLoc = gl.getUniformLocation(program, "text");
        colorLoc = gl.getUniformLocation(program, "color");
        bodyRotateLoc = gl.getUniformLocation(program, "bodyRotate");
	
	document.getElementById("deFov").onclick = function() {
		if(fovy > 60) fovy -= 10;
	};
	
	document.getElementById("inFov").onclick = function() {
		if(fovy < 120) fovy += 10;
	};
	
	document.getElementById("shade").onclick = function() {
		shader = !shader;
	};
	document.getElementById("texture").onclick = function() {
                ptext = !ptext;
        };
        document.getElementById("anime").onclick = function() {
                anime = !anime;
                if(anime == false) {
                   bob.hierConstruct(1);
                   bill.hierConstruct(1);
                   max.hierConstruct(1);
                   craig.hierConstruct(1);
                }
        };
        document.getElementById("first").onclick = function() {
                if(anime != true)bob.moveFirst();
        };
        document.getElementById("second").onclick = function() {
                if(anime != true)bob.moveSecond();
        };
	window.onkeydown = function(event) {
		var key = String.fromCharCode(event.keyCode);
		switch(key) {
			case 'w': 
			case 'W':
                        dir = "front";
			break;
			case 's': 
			case 'S':
                        dir = "back";
			break;
			case 'a': 
			case 'A':
                        dir = "left";
			break;
			case 'd': 
			case 'D':
                        dir = "right";
			break;
			case 'z': 
			case 'Z':
			eye[0] -= .3;
			break;
			case 'x': 
			case 'X':
			eye[0] += .3;
			break;
			case 'c': 
			case 'C':
			eye[1] += .3;
			break;
			case 'v': 
			case 'V':
			eye[1] -= .3;
			break;
			case 'r': 
			case 'R':
			lightPos[0] += .3;
			break;
			case 'f': 
			case 'F':
			lightPos[0] -= .3;
			break;
			case 't': 
			case 'T':
			lightPos[1] += .3;
			break;
			case 'g': 
			case 'G':
			lightPos[1] -= .3;
			break;
			case 'y': 
			case 'Y':
			lightPos[2] += .3;
			break;
			case 'h': 
			case 'H':
			lightPos[2] -= .3;
			break;
		}
	};
	
    var myVar = setInterval
    (
        function () 
        {
            render(texture0, texture1);
        }, 106
    );
};

function generateSText(textName) {
	texture0 = CreateTexture(textName);
	gl.bindTexture(gl.TEXTURE_2D, texture0);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function setHeights() {
    var result = [];
    count = 0;
    for(var i = 0; i < 256; ++i) {
        for(var j = 0; j < 256; ++j) {
            var color = data[count++]/50;
            result.push(color);
        }
    }
    return result;
}

function getHeight(x, z) {
   x = x + 32;
   z = z + 32;
   var high = heights[z * 256 + x];
   if( high < heights[(z+1) * 256 + x] ) high = heights[(z+1) * 256 + x];
   if( high < heights[(z-1) * 256 + x] ) high = heights[(z-1) * 256 + x];
   if( high < heights[z * 256 + (x+1)] ) high = heights[z * 256 + (x+1)];
   if( high < heights[z * 256 + (x-1)] ) high = heights[z * 256 + (x-1)];
   return high;
}

function generatePText(textName) {
	texture1 = CreateTexture(textName);
    	gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
                    gl.NEAREST );
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
   	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

function doMouseDown(event) {
	mouseDown = true;
	mousePosition.oldx = event.pageX;
	mousePosition.oldy = event.pageY;
}

function doMouseUp(event) {
	mouseDown = false;
}

function doMouseOut(event) {
	mouseDown = false;
}

function doMouseMove(event) {
	if(mouseDown == false) return;
	//gets new position
	mousePosition.newx = event.pageX;
	mousePosition.newy = event.pageY;
	//handle difference in coordinates
	xdifference = mousePosition.newx - mousePosition.oldx;
	ydifference = mousePosition.newy - mousePosition.oldy;
	xoffset = xdifference/256;
	yoffset = ydifference/256;
	//add transformation
	at[0] += xoffset;
	at[1] -= yoffset;
	//sets old position to new position
	mousePosition.oldx = event.pageX;
	mousePosition.oldy = event.pageY;
}

function doMouseWheel(event) {
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if(delta == 1) {
		eye[2] -= .3;
	} else {
		eye[2] += .3;
	}
}

function CreateTexture(file) 
{
    var texture = gl.createTexture();
    var image = new Image();

    image.onload = function() 
    {
        initTexture(image, texture);
    }
    image.src = file;

    return texture;
}

function initTexture(image, texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
}

function GeneratePlane()
{
    //The texture is in wrap = repeat so access outside the 0-1 mapped back into range.
    for(var z = 0; z < 64; ++z) {
       for(var x = 0; x < 64; ++x) {
          var verticesBegin = vertices.length;
          vertices.push(Vertex(vec3(x, heights[z * 256 + x], z), vec2(0,0), vec3(x, heights[z * 256 + x], z)));
          vertices.push(Vertex(vec3(x, heights[(z+1) * 256 + x], z + 1), vec2(0,1), vec3(x, heights[(z+1) * 256 + x], z + 1)));
          vertices.push(Vertex(vec3(x + 1, heights[(z+1) * 256 + (x+1)], z + 1), vec2(1,1), vec3(x + 1, heights[(z+1) * 256 + (x+1)], z + 1)));
          vertices.push(Vertex(vec3(x + 1, heights[z * 256 + (x+1)], z), vec2(1,0), vec3(x + 1, heights[z * 256 + (x+1)], z)));
          indices.push(0 + verticesBegin, 1 + verticesBegin, 2 + verticesBegin);
          indices.push(0 + verticesBegin, 2 + verticesBegin, 3 + verticesBegin);
          //console.log(indices);
       }
    }
    planeIndicesLength = indices.length;
}

function GenerateSphere()
{

    var SPHERE_DIV = 25;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var verticesBegin = vertices.length;
    // Generate coordinates
    for (j = 0; j <= SPHERE_DIV; j++) 
    {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);

        for (i = 0; i <= SPHERE_DIV; i++) 
        {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            var x = si * sj;
            var y = cj;      
            var z = ci * sj; 
            vertices.push(Vertex(vec3(x, y, z), vec2(i/SPHERE_DIV, (1 - y)/2), vec3(x, y, z)));

        }
    }

    // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) 
    {
        for (i = 0; i < SPHERE_DIV; i++) 
        {
            p1 = j * (SPHERE_DIV+1) + i;
            p2 = p1 + (SPHERE_DIV+1);

            indices.push(p1 + verticesBegin);
            indices.push(p2 + verticesBegin);
            indices.push(p1 + 1 + verticesBegin);

            indices.push(p1 + 1 + verticesBegin);
            indices.push(p2 + verticesBegin);
            indices.push(p2 + 1 + verticesBegin);
        }
    }
}

function calModelView(temp1, temp2, scaleMatrix, showText, color, brot) {
	var lookAtMatrix = lookAt(eye, at, up);
	var projectionMatrix = perspective(fovy, 1.1, .1, 320.0);
	var rx = rotate(temp1[0], vec3(1,0,0));
	var ry = rotate(temp1[1], vec3(0,1,0));
	var rz = rotate(temp1[2], vec3(0,0,1));
  
        var brx = rotate(brot[0], vec3(1,0,0));
        var bry = rotate(brot[1], vec3(0,1,0));
        var brz = rotate(brot[2], vec3(0,0,1));
        var bodyRotMatrix = mult(mult(brz, bry), brx);

	var tr = translate(temp2[0], temp2[1], temp2[2]);
	var rot = mult(mult(rz,ry),rx);
	var modelMatrix = mult(tr, rot);
	modelMatrix = mult(modelMatrix, scaleMatrix);
	var modelViewMatrix = mult(lookAtMatrix, modelMatrix);	
	var normalMatrix = mat4();
	var inv = new Float32Array(16);
	for(var i = 0; i < inv.length; ++i) {
		inv[i] = modelMatrix[Math.floor(i/4)][i%4];
	}
	var temp = new Float32Array(16);
	mat4Invert(inv, temp);
	for(var i = 0; i < temp.length; ++i) {
		normalMatrix[Math.floor(i/4)][i%4] = temp[i];
	}
	normalMatrix = transpose(normalMatrix);
	
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(modelMatrix) );
	gl.uniformMatrix4fv( normalMatrixLoc, false, flatten(normalMatrix) );
        gl.uniformMatrix4fv( bodyRotateLoc, false, flatten(bodyRotMatrix) );
	gl.uniform3fv( lightPosLoc, lightPos);
	if(shader) {
		gl.uniform1i(shaderLoc, 1);
	} else {
		gl.uniform1i(shaderLoc, 0);
	}
	if(showText) {
		gl.uniform1i(textLoc, 1);
	} else {
		gl.uniform1i(textLoc, 0);
	}
        gl.uniform1i(colorLoc, color);
}

function mat4Invert(m, inverse) {
    var inv = new Float32Array(16);
    inv[0] = m[5]*m[10]*m[15]-m[5]*m[11]*m[14]-m[9]*m[6]*m[15]+
             m[9]*m[7]*m[14]+m[13]*m[6]*m[11]-m[13]*m[7]*m[10];
    inv[4] = -m[4]*m[10]*m[15]+m[4]*m[11]*m[14]+m[8]*m[6]*m[15]-
             m[8]*m[7]*m[14]-m[12]*m[6]*m[11]+m[12]*m[7]*m[10];
    inv[8] = m[4]*m[9]*m[15]-m[4]*m[11]*m[13]-m[8]*m[5]*m[15]+
             m[8]*m[7]*m[13]+m[12]*m[5]*m[11]-m[12]*m[7]*m[9];
    inv[12]= -m[4]*m[9]*m[14]+m[4]*m[10]*m[13]+m[8]*m[5]*m[14]-
             m[8]*m[6]*m[13]-m[12]*m[5]*m[10]+m[12]*m[6]*m[9];
    inv[1] = -m[1]*m[10]*m[15]+m[1]*m[11]*m[14]+m[9]*m[2]*m[15]-
             m[9]*m[3]*m[14]-m[13]*m[2]*m[11]+m[13]*m[3]*m[10];
    inv[5] = m[0]*m[10]*m[15]-m[0]*m[11]*m[14]-m[8]*m[2]*m[15]+
             m[8]*m[3]*m[14]+m[12]*m[2]*m[11]-m[12]*m[3]*m[10];
    inv[9] = -m[0]*m[9]*m[15]+m[0]*m[11]*m[13]+m[8]*m[1]*m[15]-
             m[8]*m[3]*m[13]-m[12]*m[1]*m[11]+m[12]*m[3]*m[9];
    inv[13]= m[0]*m[9]*m[14]-m[0]*m[10]*m[13]-m[8]*m[1]*m[14]+
             m[8]*m[2]*m[13]+m[12]*m[1]*m[10]-m[12]*m[2]*m[9];
    inv[2] = m[1]*m[6]*m[15]-m[1]*m[7]*m[14]-m[5]*m[2]*m[15]+
             m[5]*m[3]*m[14]+m[13]*m[2]*m[7]-m[13]*m[3]*m[6];
    inv[6] = -m[0]*m[6]*m[15]+m[0]*m[7]*m[14]+m[4]*m[2]*m[15]-
             m[4]*m[3]*m[14]-m[12]*m[2]*m[7]+m[12]*m[3]*m[6];
    inv[10]= m[0]*m[5]*m[15]-m[0]*m[7]*m[13]-m[4]*m[1]*m[15]+
             m[4]*m[3]*m[13]+m[12]*m[1]*m[7]-m[12]*m[3]*m[5];
    inv[14]= -m[0]*m[5]*m[14]+m[0]*m[6]*m[13]+m[4]*m[1]*m[14]-
             m[4]*m[2]*m[13]-m[12]*m[1]*m[6]+m[12]*m[2]*m[5];
    inv[3] = -m[1]*m[6]*m[11]+m[1]*m[7]*m[10]+m[5]*m[2]*m[11]-
             m[5]*m[3]*m[10]-m[9]*m[2]*m[7]+m[9]*m[3]*m[6];
    inv[7] = m[0]*m[6]*m[11]-m[0]*m[7]*m[10]-m[4]*m[2]*m[11]+
             m[4]*m[3]*m[10]+m[8]*m[2]*m[7]-m[8]*m[3]*m[6];
    inv[11]= -m[0]*m[5]*m[11]+m[0]*m[7]*m[9]+m[4]*m[1]*m[11]-
             m[4]*m[3]*m[9]-m[8]*m[1]*m[7]+m[8]*m[3]*m[5];
    inv[15]= m[0]*m[5]*m[10]-m[0]*m[6]*m[9]-m[4]*m[1]*m[10]+
             m[4]*m[2]*m[9]+m[8]*m[1]*m[6]-m[8]*m[2]*m[5];

    var det = m[0]*inv[0]+m[1]*inv[4]+m[2]*inv[8]+m[3]*inv[12];
    if (det == 0) return false;
    det = 1.0 / det;
    for (var i = 0; i < 16; i++) inverse[i] = inv[i] * det;
    return true;
}

function render(texture0, texture1)
{	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var scaleMatrix = scale(1,1,1);
	calModelView(reset1, reset2, scaleMatrix, ptext, 2, reset1);
	
	gl.bindTexture(gl.TEXTURE_2D, texture1); 
	
	gl.drawElements(gl.TRIANGLES, planeIndicesLength, gl.UNSIGNED_SHORT, 0);
        if(anime) {
        for(var i = 0; i < beasts.length; ++i) {
           var beast = beasts[i];
           var total = 0;
           var j = 0;
           while(j < beast.bodyIndices.length) {
                 beast.setDir(j);
                 beast.move(j);
              var sizeOfInd = beast.bodyIndices[j];
              calModelView(beast.theta[j], beast.tpos[j], scaleMatrix, stext, j, beast.bodyRotate);

              gl.bindTexture(gl.TEXTURE_2D, texture0);

              gl.drawElements(gl.TRIANGLES, sizeOfInd, gl.UNSIGNED_SHORT, (planeIndicesLength + total) * Uint16Array.BYTES_PER_ELEMENT);
              total += sizeOfInd;
              if(j == (beast.bodyIndices.length - 1))beast.randomDirection();
              j += 1;
           }
        }} else {
           var beast = beasts[0];
           var total = 0;
           var j = 0;
           while(j < beast.bodyIndices.length) {
              var sizeOfInd = beast.bodyIndices[j];
              calModelView(beast.theta[j], beast.tpos[j], scaleMatrix, stext, j, beast.bodyRotate);

              gl.bindTexture(gl.TEXTURE_2D, texture0);

              gl.drawElements(gl.TRIANGLES, sizeOfInd, gl.UNSIGNED_SHORT, (planeIndicesLength + total) * Uint16Array.BYTES_PER_ELEMENT);
              total += sizeOfInd;
              j += 1;
           }
        }
}

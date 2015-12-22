
var canvas;
var gl;
var program;
var mouseDown = false;
var phong = true;
var shadeless = false;
var toon = false;
var gouraud = false;
var Vertex = true;

var mousePosition = {
	oldx:0,
	oldy:0,
	newx:0,
	newy:0
	};

var points = [];
var normals = [];
var colors = [];
var ppoints = [];
var pcolors = [];
var pnormals = [];
var pcBuffer;
var pvBuffer;
var pnBuffer;
var cBuffer;
var vBuffer;
var vnBuffer;

var numTimesToSubdivide = 3;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var reset = [0, 0, 0];
var tpos = [0.0, 0.0, 0.0];

var va = vec4(0.0, 0.0, -1.0,3.5);
var vb = vec4(0.0, 0.942809, 0.333333, 3.5);
var vc = vec4(-0.816497, -0.471405, 0.333333, 3.5);
var vd = vec4(0.816497, -0.471405, 0.333333,3.5);

var eye = vec3(0.0, 0.1, 0.7);
var at = vec3(0.0, 0.0, -1.0);
var up = vec3(0.0, 1.0, 0.0);
var fovy = 90;

var lightPos = vec3(3.0,3.0,2.0);

var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var modelMatrixLoc;
var lightPosLoc;
var vPosition;
var vColor;
var vNormal;
var phongLoc;
var gouraudLoc;
var toonLoc;

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
    
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

	addPlane();
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
	
	pcBuffer = gl.createBuffer();
	
    cBuffer = gl.createBuffer();
	
	pvBuffer = gl.createBuffer();
	
    vBuffer = gl.createBuffer();
	
	pnBuffer = gl.createBuffer();

	vnBuffer = gl.createBuffer();
	
    vColor = gl.getAttribLocation( program, "vColor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );
	vNormal = gl.getAttribLocation( program, "vNormal" );
	
	projectionMatrixLoc = gl.getUniformLocation(program, "Projection");
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelView");
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	phongLoc = gl.getUniformLocation(program, "Phong");
	gouraudLoc = gl.getUniformLocation(program, "Gouraud");
	toonLoc = gl.getUniformLocation(program, "Toon");
	lightPosLoc = gl.getUniformLocation(program, "lightPos");
	
	document.getElementById("roX").onclick = function() {
		axis = xAxis;
	};

	document.getElementById("roY").onclick = function() {
		axis = yAxis;
	};
	
	document.getElementById("roZ").onclick = function() {
		axis = zAxis;
	};
	
	document.getElementById("deFov").onclick = function() {
		if(fovy > 60) fovy -= 10;
	};
	
	document.getElementById("inFov").onclick = function() {
		if(fovy < 120) fovy += 10;
	};
	
	document.getElementById("shade").onclick = function() {
		shadeless = true;
		phong = false;
		gouraud = false;
		toon = false;
	};
	
	document.getElementById("shade1").onclick = function() {
		shadeless = false;
		phong = true;
		gouraud = false;
		toon = false;
	};
	
	document.getElementById("shade2").onclick = function() {
		shadeless = false;
		phong = false;
		gouraud = true;
		toon = false;
	};
	
	document.getElementById("shade3").onclick = function() {
		shadeless = false;
		phong = false;
		gouraud = false;
		toon = true;
	};
	
	document.getElementById("shade4").onclick = function() {
		Vertex = !Vertex;
		points.length = 0;
		colors.length = 0;
		normals.length = 0;
		tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	};
	
	window.onkeydown = function(event) {
		var key = String.fromCharCode(event.keyCode);
		switch(key) {
			case 'w': 
			case 'W':
			tpos[2] += .3;
			break;
			case 's': 
			case 'S':
			tpos[2] -= .3;
			break;
			case 'a': 
			case 'A':
			tpos[0] -= .3;
			break;
			case 'd': 
			case 'D':
			tpos[0] += .3;
			break;
			case 'q': 
			case 'Q':
			tpos[1] += .3;
			break;
			case 'e': 
			case 'E':
			tpos[1] -= .3;
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
	
    render();
};

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

function addPlane()
{
    var bc = vec4(0.0, 0.0, 0.0, 1.0);
	var wc = vec4(0.2, 0.2, 1.0, 1.0);
    // add colors and vertices for one triangle
    var i = 0;
    var white = false;
    for (var z = 3.0; z > -3.0; z -= 0.3) {
	for (var x = -3.0; x < 3.0; x += 0.3) {
	    if (white == false) {
		// Add 6 colors to current square.
			pcolors.push( bc, bc, bc, bc, bc, bc );
	    }
	    else {
		// Add 6 different colors to current square.
			pcolors.push( wc, wc, wc, wc, wc, wc );
	    }
	    var a = vec4(x, -0.3, z, 1.0);
		var b = vec4(x+0.3, -0.3, z, 1.0);
		var c = vec4(x, -0.3, z-0.3, 1.0);
		var d = vec4(x+0.3, -0.3, z-0.3, 1.0);
		ppoints.push(a,b,c,b,c,d);
		//a = normalize(a, true);
        //b = normalize(b, true);
        //c = normalize(c, true);
		//d = normalize(d, true);
		pnormals.push(a,b,c,b,c,d);
		white = !white;
	}
    }
}

function triangle(a, b, c) {
	var sphereColor = vec4(0.0, 1.0, 0.0, 1.0);

	if(Vertex) {
		normals.push(a);
		normals.push(b);
		normals.push(c);
	} else {
		var faceNormal = vec4(cross(subtract(c,a), subtract(b,a)),  1.0);
		normals.push(faceNormal);
		normals.push(faceNormal);
		normals.push(faceNormal);
	}
	
	colors.push(sphereColor, sphereColor, sphereColor, sphereColor, sphereColor, sphereColor)
     
    points.push(a);
    points.push(b);      
    points.push(c);
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function calModelView(temp1, temp2) {
	var lookAtMatrix = lookAt(eye, at, up);
	var projectionMatrix = perspective(fovy, 1.1, .1, 100.0);
	var rx = rotate(temp1[0], vec3(1,0,0));
	var ry = rotate(temp1[1], vec3(0,1,0));
	var rz = rotate(temp1[2], vec3(0,0,1));

	var tr = translate(temp2[0], temp2[1], temp2[2]);
	var rot = mult(mult(rz,ry),rx);
	var modelMatrix = mult(tr, rot);
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
	gl.uniform3fv( lightPosLoc, lightPos);
	if(shadeless) {
		gl.uniform1i( phongLoc, 0);
		gl.uniform1i( gouraudLoc, 0);
		gl.uniform1i( toonLoc, 0);
	} 
	if(phong) {
		gl.uniform1i( phongLoc, 1);
		gl.uniform1i( gouraudLoc, 0);
		gl.uniform1i( toonLoc, 0);
	}
	if(gouraud) {
		gl.uniform1i( phongLoc, 0);
		gl.uniform1i( gouraudLoc, 1);
		gl.uniform1i( toonLoc, 0);
	}
	if(toon) {
		gl.uniform1i( phongLoc, 0);
		gl.uniform1i( gouraudLoc, 0);
		gl.uniform1i( toonLoc, 1);
	}
}

function rebindBuffer(bvBuffer, bcBuffer, bnBuffer, bpoints, bcolors, bnormals) {
	gl.bindBuffer(gl.ARRAY_BUFFER, bcBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(bcolors), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	gl.bindBuffer(gl.ARRAY_BUFFER, bnBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(bnormals), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vNormal );
    gl.bindBuffer(gl.ARRAY_BUFFER, bvBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(bpoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0,0);
	gl.enableVertexAttribArray( vPosition );
	for( var i=0; i<bpoints.length; i+=3) 
		gl.drawArrays( gl.TRIANGLES, i, 3 );
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

function render()
{	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	calModelView(reset, reset);
	
	rebindBuffer(pvBuffer, pcBuffer, pnBuffer, ppoints, pcolors, pnormals);
	
    theta[axis] += 2.0;
	
	calModelView(theta, tpos);
	
	rebindBuffer(vBuffer, cBuffer, vnBuffer, points, colors, normals);
	
	requestAnimFrame(render);
}

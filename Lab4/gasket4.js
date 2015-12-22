
var canvas;
var gl;
var program;
var projectionMatrix;
var mouseDown = false;

var mousePosition = {
	oldx:0,
	oldy:0,
	newx:0,
	newy:0
	};

var points = [];
var colors = [];
var ppoints = [];
var pcolors = [];
var pcBuffer;
var pvBuffer;
var cBuffer;
var vBuffer;

var NumTimesToSubdivide = 1;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var reset = [0, 0, 0];
var tpos = [0.0, 0.0, 0.0];

var vertices = [
        vec3(  0.0000,  0.0000, -0.2500 ),
        vec3(  0.0000,  0.2357,  0.0833 ),
        vec3( -0.2042, -0.1179,  0.0833 ),
        vec3(  0.2042, -0.1179,  0.0833 )
    ];
var eye = vec3(0.0, 1.0, 1.0);
var at = vec3(0.0, 0.0, -1.0);
var up = vec3(0.0, 1.0, 0.0);
var fovy = 90;

var projectionMatrixLoc;
var modelViewMatrixLoc;
	

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
    
    
    
    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);

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
	
    vColor = gl.getAttribLocation( program, "vColor" );

	pvBuffer = gl.createBuffer();
	
    vBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation( program, "vPosition" );
	
	rebindBuffer(vBuffer, cBuffer, points, colors);
	
	projectionMatrixLoc = gl.getUniformLocation(program, "Projection");
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelView");
	
	document.getElementById("slider1").onchange = function() {
		NumTimesToSubdivide = event.srcElement.value;
		points.length = 0;
		colors.length = 0;
		divideTetra(vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);
	};
	
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

    // add colors and vertices for one triangle
    var i = 0;
    var white = false;
    for (var z = 16; z > -16; z -= 1) {
	for (var x = -16; x < 16; x += 1) {
		// Add 6 colors to current square.
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			pcolors.push( vec3(.75, 1*(data[i]/10), 0) );
			var a = vec3(x, -.3, z);
			var b = vec3(x+1, -.3, z);
			var c = vec3(x, -.3, z-1);
			var d = vec3(x+1, -.3, z-1);
			var e = vec3(x+0.5, -(data[i]/10), z-0.5);
			++i;
			ppoints.push(a,b,e,b,d,e,d,c,e,c,a,e);
	}
    }
}

function triangle( a, b, c, color )
{

    // add colors and vertices for one triangle

    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0)
    ];
    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

function tetra( a, b, c, d )
{
    // tetrahedron with each side using
    // a different color
    
    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra( a, b, c, d, count )
{
    // check for end of recursion
    
    if ( count === 0 ) {
        tetra( a, b, c, d );
    }
    
    // find midpoints of sides
    // divide four smaller tetrahedra
    
    else {
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var ad = mix( a, d, 0.5 );
        var bc = mix( b, c, 0.5 );
        var bd = mix( b, d, 0.5 );
        var cd = mix( c, d, 0.5 );

        --count;
        
        divideTetra(  a, ab, ac, ad, count );
        divideTetra( ab,  b, bc, bd, count );
        divideTetra( ac, bc,  c, cd, count );
        divideTetra( ad, bd, cd,  d, count );
    }
}

function calModelView(temp1, temp2) {
	var lookAtMatrix = lookAt(eye, at, up);
	var projectionMatrix = perspective(fovy, 1.1, .1, 100.0);
	var rx = rotate(temp1[0], vec3(1,0,0));
	var ry = rotate(temp1[1], vec3(0,1,0));
	var rz = rotate(temp1[2], vec3(0,0,1));

	var tr = translate(temp2[0], temp2[1], temp2[2]);
	var rot = mult(mult(rz,ry),rx);
	var modelViewMatrix = mult(lookAtMatrix, mult(tr, rot));

	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
}

function rebindBuffer(bvBuffer, bcBuffer, bpoints, bcolors) {
	gl.bindBuffer(gl.ARRAY_BUFFER, bcBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(bcolors), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
    gl.bindBuffer(gl.ARRAY_BUFFER, bvBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(bpoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0,0);
	gl.enableVertexAttribArray( vPosition );
    gl.drawArrays(gl.TRIANGLES, 0, bpoints.length);
}

function render()
{	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	calModelView(reset, reset);
	
	rebindBuffer(pvBuffer, pcBuffer, ppoints, pcolors);
	
    theta[axis] += 2.0;
	
	calModelView(theta, tpos);
	
	rebindBuffer(vBuffer, cBuffer, points, colors);
	
	requestAnimFrame(render);
}

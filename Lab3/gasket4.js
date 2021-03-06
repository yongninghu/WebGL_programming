
var canvas;
var gl;
var program;
var mvp;
var world = false;

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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
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
	
	mvp = gl.getUniformLocation(program, "MVP");
	
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
	
	document.getElementById("roTog").onclick = function() {
		world = !world;
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
		}
	};
	
    render();
};

function addPlane()
{

    // add colors and vertices for one triangle
	var baseColors = [
        vec3(0.25, 0.5, 0.0),
		vec3(0.0, 0.0, 1.0),
    ];
    
    var white = false;
    for (var z = 1.0; z > -1.0; z -= 0.1) {
	for (var x = -1.0; x < 1.0; x += 0.1) {
	    if (white == false) {
		// Add 6 colors to current square.
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			pcolors.push( baseColors[0]);
			var a = vec3(x, -0.3, z);
			var b = vec3(x+0.1, -0.3, z);
			var c = vec3(x, -0.3, z-0.1);
			var d = vec3(x+0.1, -0.3, z-0.1);
			var e = vec3(x+0.05, -0.3 + Math.random() * .1, z-0.05);
			ppoints.push(a,b,e,b,d,e,d,c,e,c,a,e);
	    }
	    else {
		// Add 6 different colors to current square.
			pcolors.push( baseColors[1]);
			pcolors.push( baseColors[1]);
			pcolors.push( baseColors[1]);
			pcolors.push( baseColors[1]);
			pcolors.push( baseColors[1]);
			pcolors.push( baseColors[1]);
			var a = vec3(x, -0.3, z);
			var b = vec3(x+0.1, -0.3, z);
			var c = vec3(x, -0.3, z-0.1);
			var d = vec3(x+0.1, -0.3, z-0.1);
			ppoints.push(a,b,c,b,c,d);
	    }
	    // Add 6 points that make the square. Each point
		white = !white;
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
	var projectionMatrix = perspective(75, 1.1, .1, 100.0);
	projectionMatrix = mult(projectionMatrix, translate(0, 0.3, -1.7));
	projectionMatrix = mult(projectionMatrix, rotate(25, 1, 0, 0));
	var rx = rotate(temp1[0], vec3(1,0,0));
	var ry = rotate(temp1[1], vec3(0,1,0));
	var rz = rotate(temp1[2], vec3(0,0,1));

	var tr = translate(temp2[0], temp2[1], temp2[2]);
	var rot = mult(mult(rz,ry),rx);
	if(world) {
		var modelView = mult(rot, tr);
	} else {
		var modelView = mult(tr, rot);
	}
	var finalMatrix = mult(projectionMatrix, modelView);

	gl.uniformMatrix4fv( mvp, false, flatten(finalMatrix) );
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

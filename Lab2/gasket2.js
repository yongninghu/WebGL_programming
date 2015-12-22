
var canvas;
var gl;
var mouseDown = false;

var points = [];

var NumTimesToSubdivide = 1;
var perturbation = 0;
var paintMode = false;

var vertices = [
        vec2( -.75, -.75 ),
        vec2(  0,  .75 ),
        vec2(  .75, -.75 )
    ];
	
var brushVertices = [
		vec2( -.05, -.05 ),
        vec2(  0,  .05 ),
        vec2(  .05, -.05 )
	];
var mousePosition = {
	oldx:0,
	oldy:0,
	newx:0,
	newy:0
	};

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
	
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mouseout", doMouseOut, false);


    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
    
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
	
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	gl.uniform3f(gl.getUniformLocation(program, "rbgfactor"), 1, 0, 0);
	

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	document.getElementById("slider1").onchange = function() {
		if(paintMode == true) return;
		while(points.length > 0) { points.pop(); }
		NumTimesToSubdivide = event.srcElement.value;
		updateChange();
	};
	
	document.getElementById("slider2").onchange = function() {
		if(paintMode == true) return;
		while(points.length > 0) { points.pop(); }
		perturbation = event.srcElement.value/1000;
		updateChange();
	};
	2
	document.getElementById("Reset").onclick = function() {
		paintMode = false;
		while(points.length > 0) { points.pop(); }
		document.getElementById("slider1").value = 1;
		document.getElementById("slider2").value = 0;
		perturbation = 0;
		NumTimesToSubdivide = 1;
		vertices = [
			vec2( -.75, -.75 ),
			vec2(  0,  .75 ),
			vec2(  .75, -.75 )
		];
		updateChange();
	};
	
	document.getElementById("paintMode").onclick = function() {
		paintMode = true;
		while(points.length > 0) { points.pop(); }
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, points.length );
	};

	window.onkeydown = function( event ) {
		var key = String.fromCharCode(event.keyCode);
		switch( key ) {
			case '1':
				gl.uniform3f(gl.getUniformLocation(program, "rbgfactor"), 1, 0, 0);
				updateChange();
				break;
			case '2':
				gl.uniform3f(gl.getUniformLocation(program, "rbgfactor"), 0, 1, 0);
				updateChange();
				break;
			case '3':
				gl.uniform3f(gl.getUniformLocation(program, "rbgfactor"), 0, 0, 1);
				updateChange();
				break;
		}
	};

    render();
	
};

function doMouseDown(event) {
	mouseDown = true;
	mousePosition.oldx = event.pageX;
	mousePosition.oldy = event.pageY;
	if(paintMode == true) {
		var rect = canvas.getBoundingClientRect();
		xcoord = event.clientX - rect.left;
		ycoord = event.clientY - rect.top;
		brushVertices = [
			vec2( -.05, -.05 ),
			vec2(  0,  .05 ),
			vec2(  .05, -.05 )
		];
		xdifference = xcoord - 256;
		ydifference = ycoord - 256;
		xoffset = xdifference/256;
		yoffset = ydifference/256;
		brushVertices[0][0] = brushVertices[0][0] + xoffset;
		brushVertices[0][1] = brushVertices[0][1] - yoffset;
		brushVertices[1][0] = brushVertices[1][0] + xoffset;
		brushVertices[1][1] = brushVertices[1][1] - yoffset;
		brushVertices[2][0] = brushVertices[2][0] + xoffset;
		brushVertices[2][1] = brushVertices[2][1] - yoffset;
		updateChange();
	}
}

function doMouseUp(event) {
	mouseDown = false;
}

function doMouseOut(event) {
	mouseDown = false;
}

function doMouseMove(event) {
	if(paintMode == true) return;
	if(mouseDown == false) return;
	//gets new position
	mousePosition.newx = event.pageX;
	mousePosition.newy = event.pageY;
	//handle difference in coordinates
	xdifference = mousePosition.newx - mousePosition.oldx;
	ydifference = mousePosition.newy - mousePosition.oldy;
	xoffset = xdifference/512;
	yoffset = ydifference/512;
	for(var i = 0; i < 3; ++i){
		var temp1 = vertices[i][0] + xoffset;
		var temp2 = vertices[i][1] - yoffset;
		if(1 < temp1 || temp1 < -1 ||  1 < temp2 || temp2 < -1)
		{
			if(temp1 > 1) {
				vertices[i][0] = 1;
			} 
			if(temp1 < -1)
			{
				vertices[i][0] = -.999;
			}
			if(temp2 > 1) 
			{
				vertices[i][1] = 1;
			} 
			if(temp2 < -1)
			{
				vertices[i][1] = -.999;
			}
		} else 
		{
			vertices[i][0] = temp1;
			vertices[i][1] = temp2;
		}
	}
	while(points.length > 0) { points.pop(); }
	updateChange();
	//sets old position to new position
	mousePosition.oldx = event.pageX;
	mousePosition.oldy = event.pageY;
}

function updateChange() {
	if(paintMode == true) {
		divideTriangle( brushVertices[0], brushVertices[1], brushVertices[2],
                        0);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
		render();
	} else
	{
		divideTriangle( vertices[0], vertices[1], vertices[2],
                        NumTimesToSubdivide);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
		render();
	}
}

function triangle( a, b, c )
{
	if(paintMode == true)
	{
		points.push(a,b,c);
	} else
	{
		points.push( a, b, b, c, c, a );
	}
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );
		
		ab[0] = ab[0] - perturbation;
		ab[1] = ab[1] - perturbation;
		ac[0] = ac[0] - perturbation;
		ac[1] = ac[1] + perturbation;
		bc[0] = bc[0] + perturbation;
		bc[1] = bc[1] + perturbation;
        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
	if(paintMode == true) {
		//gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, points.length );
	} else 
	{
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.LINES, 0, points.length );
	}
}


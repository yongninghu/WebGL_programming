var canvas;
var gl;
var program;
var mouseDown = false;
var shader = true;
var stext = true;
var ptext = true;

var mousePosition = {
	oldx:0,
	oldy:0,
	newx:0,
	newy:0
	};

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var mapMode = 0;
var selectedText = 'Checker.jpg';
var axis = 0;
var theta = [ 0, 0, 0 ];
var reset1 = [0, 0, 0];
var reset2 = [0, -2, 0];
var tpos = [0.0, 0.0, 0.0];

var eye = vec3(0.0, 0.1, 3.7);
var at = vec3(0.0, 0.0, -1.0);
var up = vec3(0.0, 1.0, 0.0);
var fovy = 90;

var lightPos = vec3(3.0,3.0,2.0);

var vertices = [];
var indices = [];

var texture0;
var texture1;
var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var modelMatrixLoc;
var shaderLoc;
var textLoc;
var lightPosLoc;
var vPosition;
var vNormal;

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
	
	GeneratePlane();
    GenerateSphere();
	
	var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	
	var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 3, gl.FLOAT, false, Vertex.size, Vertex.offsetPosition);
    gl.enableVertexAttribArray( aPosition );

    var aNormal = gl.getAttribLocation( program, "aNormal" );
    gl.vertexAttribPointer( aNormal, 3, gl.FLOAT, false, Vertex.size, Vertex.offsetNormal );
    gl.enableVertexAttribArray( aNormal );

    var aTextureCoord = gl.getAttribLocation( program, "aTextureCoord" );
    gl.vertexAttribPointer( aTextureCoord, 2, gl.FLOAT, false, Vertex.size, Vertex.offsetTexCoord);
    gl.enableVertexAttribArray( aTextureCoord );
	
	generateSText('earth.jpg');

    	generatePText(selectedText, mapMode);

	projectionMatrixLoc = gl.getUniformLocation(program, "Projection");
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelView");
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	shaderLoc = gl.getUniformLocation(program, "shader");
	lightPosLoc = gl.getUniformLocation(program, "lightPos");
	textLoc = gl.getUniformLocation(program, "text");
	
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
		shader = !shader;
	};
	document.getElementById("option1").onclick = function(event) {
		switch(event.target.index) {
			case 0:
				stext = false;		
				break;
			case 1:
				stext = true;
				generateSText('earth.jpg');
				break;
			case 2:
				stext = true;
				generateSText('mars.jpg');
				break;
		}
	};
	document.getElementById("option2").onclick = function(event) {
                switch(event.target.index) {
                        case 0:
				ptext = false;
                                break;
                        case 1:
				ptext = true;
				selectedText = 'Checker.jpg';
				generatePText(selectedText, mapMode);
                                break;
                        case 2:
				ptext = true;
				selectedText = 'floor.jpg';
				generatePText(selectedText, mapMode);
                                break;
                }
        };
	document.getElementById("option3").onclick = function(event) {
		switch(event.target.index) {
			case 0:
				mapMode = 0;
				generatePText(selectedText, mapMode);
				break;
			case 1:
				mapMode = 1;
				generatePText(selectedText, mapMode);
				break;
			case 2:
				mapMode = 2;
				generatePText(selectedText, mapMode);
				break;
			case 3:
				mapMode = 3;
				generatePText(selectedText, mapMode);
				break;
		}
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
	
    var myVar = setInterval
    (
        function () 
        {
            render(texture0, texture1);
        }, 16
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

function generatePText(textName, mode) {
	texture1 = CreateTexture(textName);
    	gl.bindTexture(gl.TEXTURE_2D, texture1);
	switch(mode) {
            case 0:
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.NEAREST );
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
                    gl.NEAREST );
               break;
            case 1:
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.LINEAR);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR );
               break;
            case 2:
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.LINEAR_MIPMAP_NEAREST );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
                    gl.LINEAR );
               break;
            case 3:
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                    gl.LINEAR_MIPMAP_LINEAR );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
                    gl.LINEAR );
               break

        };
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
    vertices.push(Vertex(vec3(-1, 0, -1), vec2(0, 0), vec3(0, 1, 0)));
    vertices.push(Vertex(vec3(-1, 0, 1), vec2(20, 0), vec3(0, 1, 0)));
    vertices.push(Vertex(vec3(1, 0, 1), vec2(20, 20), vec3(0, 1, 0)));
    vertices.push(Vertex(vec3(1, 0, -1), vec2(0, 20), vec3(0, 1, 0)));
    indices.push(0, 1, 2, 0, 2, 3);
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

function calModelView(temp1, temp2, scaleMatrix, showText) {
	var lookAtMatrix = lookAt(eye, at, up);
	var projectionMatrix = perspective(fovy, 1.1, .1, 100.0);
	var rx = rotate(temp1[0], vec3(1,0,0));
	var ry = rotate(temp1[1], vec3(0,1,0));
	var rz = rotate(temp1[2], vec3(0,0,1));

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
	
	var scaleMatrix = scale(50,1,50);
	calModelView(reset1, reset2, scaleMatrix, ptext);
	
	gl.bindTexture(gl.TEXTURE_2D, texture1); 
	
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	
    	theta[axis] += 2.0;
	scaleMatrix = scale(1,1,1);
	calModelView(theta, tpos, scaleMatrix, stext);
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	
	gl.drawElements(gl.TRIANGLES, indices.length-6, gl.UNSIGNED_SHORT, 6 * Uint16Array.BYTES_PER_ELEMENT);
	
}

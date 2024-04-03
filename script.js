let image = document.querySelector('img');
let canvas = document.querySelector('canvas');
canvas.style.backgroundColor = 'yellow'; //To see if the canvas is working
let webgl = canvas.getContext('webgl');

webgl.clearColor(1.0, 0.0, 0.0, 1.0); //RED
webgl.clear(webgl.COLOR_BUFFER_BIT);
let vertices = new Float32Array([
    -0.5, 0.5, 
     0.5, 0.5,
     -0.5, -0.5, 
     0.5, -0.5
]);
 
let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
// webgl.getError()

let texCo = new Float32Array([
    0.0, 1.0, //top left
    1.0, 1.0, //Top right
    0.0, 0.0, //Buttom left
    1.0, 0.0  //Buttom right
]);

let texcobuff = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, texcobuff);
webgl.bufferData(webgl.ARRAY_BUFFER, texCo, webgl.STATIC_DRAW);

//create Buffer for texture

let texbuffer = webgl.createTexture();
webgl.bindTexture(webgl.TEXTURE_2D, texbuffer);
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA,webgl.UNSIGNED_BYTE, image);
webgl.generateMipmap(webgl.TEXTURE_2D);

let vsShader = `
precision mediump float;
attribute vec2 vecposition;
attribute vec2 vTexture;
varying vec2 fTexture;
void main()
{
    fTexture = vTexture;
    gl_Position = vec4(vecposition, 0, 1.0);
    gl_PointSize = 5.2;
}
`;

let fsShader = `
precision mediump float;
varying vec2 fTexture;
uniform sampler2D fragSampler;
void main()
{
    gl_FragColor = texture2D(fragSampler, fTexture);
}
`;

let vShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vShader, vsShader);
webgl.compileShader(vShader);
if(!webgl.getShaderParameter(vShader, webgl.COMPILE_STATUS))
{
    console.log('ERROR FOUND:',webgl.getShaderInfoLog(vShader));
    webgl.deleteShader(vShader);
}

let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fShader, fsShader);
webgl.compileShader(fShader);

if(!webgl.getShaderParameter(fShader, webgl.COMPILE_STATUS))
{
    console.log('ERROR FOUND:',webgl.getShaderInfoLog(fShader));
    webgl.deleteShader(fShader);
}

let program = webgl.createProgram();
webgl.attachShader(program, vShader);
webgl.attachShader(program, fShader);
webgl.linkProgram(program);
webgl.useProgram(program);


let Position = webgl.getAttribLocation(program, 'vecposition');
console.log(Position);
webgl.enableVertexAttribArray(Position);
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texcobuff);
let TextPo = webgl.getAttribLocation(program, 'vTexture');
console.log(TextPo);
webgl.enableVertexAttribArray(TextPo);
webgl.vertexAttribPointer(TextPo, 2, webgl.FLOAT, false, 0, 0);
webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
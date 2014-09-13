var canvas,
width,
height,
tempX,
tempY;

(function() {
	width = document.body.offsetWidth;
	height = document.body.offsetHeight;

    console.log(width, height);
    
    tempX = width/2;
    tempY = height/2;

	canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';
	canvas.style.top = '0';
	canvas.style.left = '0';
	document.body.appendChild(canvas);
	
	console.log("canvas");

	if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        
		// resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
    	draw();  
    	
	}

}) ();

function draw() {

	requestAnimationFrame(draw);
}

function resizeCanvas() {
	canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
	width = document.body.offsetWidth;
    height = document.body.offsetHeight;	
}
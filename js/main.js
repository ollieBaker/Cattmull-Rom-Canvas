var canvas,
	canvasUI,
	context,
	contextUI,
	width,
	height,
	tempX,
	tempY;

var aiPathWaypoints = [],
	pathNodeTime = 2, 
	aiPathWaypointCount = 64,
	aiPathSize,
	aiPathSizeOffset,
	age = 0,
	speed = 0.5,
	date;
	

(function() {
	width = window.innerWidth;
	height = window.innerHeight;

    // console.log(width, height);
    
    tempX = width/2;
    tempY = height/2;

    aiPathSizeOffset = 100;
    aiPathSize = {x: width - aiPathSizeOffset, y: height - aiPathSizeOffset};

	canvas = createFullScreenCanvas('canvas');
	canvasUI = createFullScreenCanvas('canvasUI');	

	date = Date.now();

	generatePath();     

	if (canvas.getContext) {
        context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = true;
        window.addEventListener('resize', resizeCanvas, false);
    	draw();    	
	}

	if(canvasUI.getContext) {
		contextUI = canvasUI.getContext("2d");
        contextUI.webkitImageSmoothingEnabled = true;
    	drawUI();  
	}

	document.onclick = hideUI;

}) ();

function createFullScreenCanvas(id) {
	var c = document.createElement('canvas');
	c.id = id;
	c.width = width;
	c.height = height;
	c.style.position = 'absolute';
	c.style.top = '0';
	c.style.left = '0';
	document.body.appendChild(c);

	return c;
}

function hideUI() {
	if(canvasUI.style.visibility == "hidden") {
		canvasUI.style.visibility = "visible";
	} else {
		canvasUI.style.visibility = "hidden";
	}
}

function draw() {

	var d = Date.now();
	var dif = (d - date) / 1000;
	date = d;
	age += dif;

	context.globalAlpha = 0.05;
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.globalAlpha = 1;
	
	var pathProgress = age / pathNodeTime; 
	var newPos = calculatePathPosition(pathProgress); 

	context.beginPath();
    context.arc(newPos.x, newPos.y, 12, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();

	requestAnimationFrame(draw);
}

function drawUI() {

	contextUI.clearRect(0, 0, width, height);
    contextUI.strokeStyle = "#000000";
	for (var i = 0; i < aiPathWaypointCount; i++)
    { 
    	contextUI.fillStyle = "#FF0000";
    	contextUI.beginPath();
    	contextUI.arc(aiPathWaypoints[i].x, aiPathWaypoints[i].y, 12, 0, 2 * Math.PI, false);
    	contextUI.fill();
    	contextUI.fillStyle = "#000000"
    	contextUI.font = "16px Georgia";
    	contextUI.textAlign = 'center';
		contextUI.fillText(i, aiPathWaypoints[i].x -0, aiPathWaypoints[i].y + 4);
    } 
	contextUI.fillStyle = "#FFFFFF";
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasUI.width = window.innerWidth;
    canvasUI.height = window.innerHeight;
    drawUI();
	width = window.innerWidth;
    height = window.innerHeight;	
}

function spline (p0, p1, p2, p3, t)  
{ 
    return {
    	x:
        0.5 * ((2 * p1.x) + 
        t * (( -p0.x + p2.x) + 
        t * ((2 * p0.x -5 * p1.x +4 * p2.x -p3.x) + 
        t * ( -p0.x +3 * p1.x -3 * p2.x +p3.x)))), 
        y:
        0.5 * ((2 * p1.y) + 
        t * (( -p0.y + p2.y) + 
        t * ((2 * p0.y -5 * p1.y +4 * p2.y -p3.y) + 
        t * (  -p0.y +3 * p1.y -3 * p2.y +p3.y)))) 
    };
} 

function generatePath()
{ 
    console.log("Generating AI path"); 
    aiPathWaypoints = [];    
    var n = aiPathWaypointCount; 
    for (var i = 0; i < n; i++)  
    { 
        aiPathWaypoints.push ( { x: (aiPathSize.x * Math.random ()) + aiPathSizeOffset/2, y: (aiPathSize.y * Math.random ()) + aiPathSizeOffset/2 } ); 
    }
} 

function calculatePathPosition(ratio)
{ 
    var i = Math.floor(ratio); 
    var pointratio = ratio - i; 
    // console.log(ratio + ' ratio = path point ' + i + ' segment ratio ' + pointratio); 
    var p0 = aiPathWaypoints [(i -1 + aiPathWaypoints.length) % aiPathWaypoints.length]; 
    var p1 = aiPathWaypoints [i % aiPathWaypoints.length]; 
    var p2 = aiPathWaypoints [(i +1 + aiPathWaypoints.length) % aiPathWaypoints.length]; 
    var p3 = aiPathWaypoints [(i +2 + aiPathWaypoints.length) % aiPathWaypoints.length]; 
    // figure out current position 
    var q = spline (p0, p1, p2, p3, pointratio); 
    return q; 
}
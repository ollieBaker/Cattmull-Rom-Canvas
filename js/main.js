var canvas,
    canvasUI,
    context,
    contextUI,
    width,
    height,
    tempX,
    tempY;

var paused = true,
    started = false,
    aiPathWaypoints = [],
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

    tempX = width / 2;
    tempY = height / 2;

    aiPathSizeOffset = 200;
    aiPathSize = {
        x: width - aiPathSizeOffset,
        y: height - aiPathSizeOffset
    };

    canvas = createFullScreenCanvas('canvas');
    canvasUI = createFullScreenCanvas('canvasUI');

    generateBetterPath();

    if (canvas.getContext) {
        context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = true;
        window.addEventListener('resize', resizeCanvas, false);
        draw();
    }

    if (canvasUI.getContext) {
        contextUI = canvasUI.getContext("2d");
        contextUI.webkitImageSmoothingEnabled = true;
        drawUI();
    }

    var reset = document.getElementById('reset');
    var start = document.getElementById('start');
    var waypoints = document.getElementById('waypoints');
    waypoints.value = aiPathWaypointCount;

    var reg = new RegExp(/^\d+$/);
    waypoints.onchange = function() {
        if (!reg.test(waypoints.value) || waypoints.value < 2 || waypoints.value > 512) {
            waypoints.value = aiPathWaypointCount;
        }
        aiPathWaypointCount = waypoints.value;
    };


    reset.onclick = function() {
        context.clearRect(0, 0, width, height);
        age = 0;
        paused = true;
        started = false;
        start.innerHTML = "Start";
        generateBetterPath();
        drawUI();
    };

    start.onclick = function() {
        if (paused) {
            paused = false;
            start.innerHTML = 'Pause';
            date = Date.now();
        } else {
            paused = true;
            start.innerHTML = 'Resume';
        }
    };

    window.onblur = function() {
        paused = true;
        if (started) {
            start.innerHTML = 'Resume';
        }
    };

    var canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.onclick = hideUI;

})();

function createFullScreenCanvas(id) {
    var c = document.createElement('canvas');
    var container = document.getElementById('canvasContainer');
    c.id = id;
    c.width = width;
    c.height = height;
    c.style.position = 'absolute';
    c.style.top = '0';
    c.style.left = '0';
    container.appendChild(c);
    return c;
}

function hideUI() {
    var uiContainer = document.getElementById('uiContainer');
    if (canvasUI.style.visibility == "hidden") {
        canvasUI.style.visibility = "visible";
        uiContainer.style.visibility = "visible";
    } else {
        canvasUI.style.visibility = "hidden";
        uiContainer.style.visibility = "hidden";
    }
}

function draw() {
    if (paused == true) {
        requestAnimationFrame(draw);
        return;
    }

    started = true;

    var d = Date.now();
    var dif = (d - date) / 1000;
    date = d;
    age += dif;

    context.globalAlpha = 0.025;
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
    for (var i = 0; i < aiPathWaypointCount; i++) {
        contextUI.fillStyle = "#FF2222";
        contextUI.beginPath();
        contextUI.arc(aiPathWaypoints[i].x, aiPathWaypoints[i].y, 12, 0, 2 * Math.PI, false);
        contextUI.fill();
        contextUI.fillStyle = "#000000"
        contextUI.font = "15px sans-serif";
        contextUI.textAlign = 'center';
        contextUI.fillText(i, aiPathWaypoints[i].x, aiPathWaypoints[i].y + 6);
    }
    contextUI.fillStyle = "#FFFFFF";
}

function resizeCanvas() {
    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasUI.width = window.innerWidth;
    canvasUI.height = window.innerHeight;
    drawUI();
    width = window.innerWidth;
    height = window.innerHeight;*/
}

function spline(p0, p1, p2, p3, t) {
    return {
        x: 0.5 * ((2 * p1.x) +
            t * ((-p0.x + p2.x) +
                t * ((2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) +
                    t * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x)))),
        y: 0.5 * ((2 * p1.y) +
            t * ((-p0.y + p2.y) +
                t * ((2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) +
                    t * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y))))
    };
}

function generateBetterPath() {
    var gridSize = 78;
    var halfGridSize = gridSize * 0.5;
    var gridX = Math.floor(width / gridSize) - 2;
    var gridY = Math.floor(height / gridSize) - 1;

    var points = [];
    for (var i = 0; i < gridX; i++) {
        for (var j = 0; j < gridY; j++) {
            points.push({
                x: (i * gridSize) + (halfGridSize + gridSize),
                y: (j * gridSize) + (halfGridSize + gridSize)
            });
        }
    }

    aiPathWaypoints = [];
    var n = aiPathWaypointCount;
    for (var i = 0; i < n; i++) {
        var rnd = Math.floor(Math.random() * points.length);
        var p = points[rnd];
        p = jitter(p, gridSize * 0.3);
        aiPathWaypoints.push(p);
        points.splice(rnd, 1);
    }
    point = null;
}

function jitter(point, jitter) {
    var rnd = -Math.random() * jitter;
    if (Math.random() > 0.5) {
        rnd = Math.abs(rnd);
    }
    console.log(point, rnd);
    point.x += rnd;
    point.y += rnd;
    return point;
}

function generatePath() {
    console.log("Generating random path");
    aiPathWaypoints = [];
    var n = aiPathWaypointCount;
    for (var i = 0; i < n; i++) {
        aiPathWaypoints.push({
            x: (aiPathSize.x * Math.random()) + aiPathSizeOffset / 2,
            y: (aiPathSize.y * Math.random()) + aiPathSizeOffset / 2
        });
    }
}

function calculatePathPosition(ratio) {
    var i = Math.floor(ratio);
    var pointratio = ratio - i;
    // console.log(ratio + ' ratio = path point ' + i + ' segment ratio ' + pointratio); 
    var p0 = aiPathWaypoints[(i - 1 + aiPathWaypoints.length) % aiPathWaypoints.length];
    var p1 = aiPathWaypoints[i % aiPathWaypoints.length];
    var p2 = aiPathWaypoints[(i + 1 + aiPathWaypoints.length) % aiPathWaypoints.length];
    var p3 = aiPathWaypoints[(i + 2 + aiPathWaypoints.length) % aiPathWaypoints.length];
    // figure out current position 
    var q = spline(p0, p1, p2, p3, pointratio);
    return q;
}

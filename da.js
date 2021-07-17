const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// fillRect() will make rectangles

const circle = {
    x: 50,
    y: 300,
    size: 25,
    dx: 5,
    dy: 0,
};

function drawCircle (){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI *2);
    ctx.fillStyle = 'coral';
    ctx.fill();

}
function update(){
// clears the canvas

    ctx.clearRect(0 , 0 , canvas.width , canvas.height);

// draws the circle
    drawCircle();
// updates x to make the movement
    circle.x += circle.dx;

    requestAnimationFrame(update);

}

// update();
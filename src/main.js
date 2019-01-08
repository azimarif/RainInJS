class Drop {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  updateDrop() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
    if (this.x > rainCanvas.width || this.y > rainCanvas.height) {
      this.x = random(0, rainCanvas.width);
      this.y = -20;
    }
  }

  getDropCurrentPosition() {
    return {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy
    };
  }
}

let rainCanvas = document.getElementById('rain');
rainCanvas.width = window.innerWidth;
rainCanvas.height = window.innerHeight;
let rainContext = rainCanvas.getContext('2d');

let drops = [];
const numberOfDrops = 1000;

const random = function(min, max) {
  return Math.random() * (max - min + 1) + min;
};

const initCanvasContext = function(context, lineWidth) {
  context.strokeStyle = 'rgba(174,194,224,0.5)';
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
};

const createDrops = function() {
  for (let drop = 1; drop < numberOfDrops; drop++) {
    let x = random(0, rainCanvas.width);
    let y = random(0, rainCanvas.height);
    let dx = random(-2, 1);
    let dy = random(10, 20);
    drops.push(new Drop(x, y, dx, dy));
  }
};

const drawDrop = function({ x, y, dx, dy }) {
  rainContext.beginPath();
  rainContext.moveTo(x, y);
  rainContext.lineTo(x + dx, y + dy);
  rainContext.stroke();
};

createDrops();
initCanvasContext(rainContext, 1);

setInterval(() => {
  rainContext.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  drops.forEach(drop => {
    drop.updateDrop();
    let dropCurretPosition = drop.getDropCurrentPosition();
    drawDrop(dropCurretPosition);
  });
}, 30);
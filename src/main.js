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

class Lightning {
  constructor(x, y, dx, dy, path) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.path = path;
  }

  increaseLightning() {
    return ({
      x:
        this.path[this.path.length - 1].x +
        (random(0, this.dx) - this.dx / 2),
      y: this.path[this.path.length - 1].y + random(0, this.dy)
    });
  }
}

let rainCanvas = document.getElementById('rain');
rainCanvas.width = window.innerWidth;
rainCanvas.height = window.innerHeight;
let rainContext = rainCanvas.getContext('2d');

let lightningCanvas = document.getElementById('lightning');
lightningCanvas.width = window.innerWidth;
lightningCanvas.height = window.innerHeight;
let lightningContext = lightningCanvas.getContext('2d');

let drops = [];
const numberOfDrops = 1000;
let lightnings = [];

let lightningTime = 0;
let lightningTimeTotal = 0;

const random = function (min, max) {
  return Math.random() * (max - min + 1) + min;
};

const initCanvasContext = function (context, lineWidth) {
  context.strokeStyle = 'rgba(174,194,224,0.5)';
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
};

const createDrops = function () {
  for (let drop = 1; drop < numberOfDrops; drop++) {
    let x = random(0, rainCanvas.width);
    let y = random(0, rainCanvas.height);
    let dx = random(-2, 1);
    let dy = random(10, 20);
    drops.push(new Drop(x, y, dx, dy));
  }
};

const createLightning = function () {
  let x = random(100, lightningCanvas.width - 100);
  let y = random(0, lightningCanvas.height / 4);

  let numberOfLightning = random(1, 3);
  for (let lightning = 0; lightning < numberOfLightning; lightning++) {
    let dx = random(5, 30);
    let dy = random(10, 25);
    let path = [{ x, y }];
    lightnings.push(new Lightning(x, y, dx, dy, path));
  }
};

const drawDrop = function ({ x, y, dx, dy }) {
  rainContext.beginPath();
  rainContext.moveTo(x, y);
  rainContext.lineTo(x + dx, y + dy);
  rainContext.stroke();
};

function drawLightning() {
  lightnings.forEach(lightning => {
    lightning.path.push(lightning.increaseLightning());

    lightningContext.strokeStyle = 'rgba(255, 255, 255, .1)';
    lightningContext.beginPath();
    lightningContext.moveTo(lightning.x, lightning.y);

    for (let pc = 0; pc < lightning.path.length / 8; pc++) {
      lightningContext.lineTo(lightning.path[pc].x, lightning.path[pc].y);
    }
    lightningContext.stroke();
  })
}

const clearLightningCanvas = function () {
  lightningContext.globalCompositeOperation = 'destination-out';
  lightningContext.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + ')';
  lightningContext.fillRect(0, 0, lightningCanvas.width, lightningCanvas.height);
  lightningContext.globalCompositeOperation = 'source-over';
};

const animateLightning = function () {
  clearLightningCanvas();
  lightningTime++;
  if (lightningTime > lightningTimeTotal) {
    lightnings = [];
    createLightning();
    lightningTime = 0;
    lightningTimeTotal = random(100, 200);
  }
  drawLightning();
};

createDrops();
initCanvasContext(rainContext, 1);
initCanvasContext(lightningContext, 3);

setInterval(() => {
  rainContext.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  drops.forEach(drop => {
    drop.updateDrop();
    let dropCurretPosition = drop.getDropCurrentPosition();
    drawDrop(dropCurretPosition);
  });
  animateLightning();
}, 30);
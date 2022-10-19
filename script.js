const canvas = document.querySelector("canvas");
const collapseLinesBtn = document.querySelector("button");

canvas.width = 700;
canvas.height = 500;

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

const ctx = canvas.getContext("2d");

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
  }

  collapse() {
    if (this.x1 > this.x2) {
      this.x1 = this.x1 - (this.x1 - this.x2) / 100;
      this.x2 = this.x2 + (this.x1 - this.x2) / 100;
    } else {
      this.x1 = this.x1 + (this.x2 - this.x1) / 100;
      this.x2 = this.x2 - (this.x2 - this.x1) / 100;
    }

    if (this.y1 > this.y2) {
      this.y1 = this.y1 - (this.y1 - this.y2) / 100;
      this.y2 = this.y2 + (this.y1 - this.y2) / 100;
    } else {
      this.y1 = this.y1 + (this.y2 - this.y1) / 100;
      this.y2 = this.y2 - (this.y2 - this.y1) / 100;
    }
  }
}

let arr = [];
let linesArray = [];

canvas.addEventListener("click", (event) => {
  if (arr.length < 2) {
    arr.push(event.offsetX);
    arr.push(event.offsetY);
  } else {
    arr.push(event.offsetX);
    arr.push(event.offsetY);

    const line = new Line(arr[0], arr[1], arr[2], arr[3]);
    linesArray.push(line);

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    linesArray.forEach((el) => {
      el.draw();
    });
    createDots(linesArray);
    arr = [];
  }
});

let draw = false;
const array = [];
let mouse = {};
let start_coords = {};
let resault_coords = {};

window.addEventListener("contextmenu", () => {
  draw = false;
  mouse = {};
  start_coords = {};
  resault_coords = {};
});

canvas.addEventListener("mousedown", (event) => {
  if (draw) {
    draw = false;
    array.push([
      start_coords.x,
      start_coords.y,
      resault_coords.x,
      resault_coords.y,
    ]);
  } else {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    start_coords.x = mouse.x;
    start_coords.y = mouse.y;
    draw = true;
  }
});
canvas.addEventListener("mousemove", (event) => {
  if (draw) {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    linesArray.forEach((el) => {
      el.draw();
    });
    createDots(linesArray);

    ctx.beginPath();
    ctx.moveTo(start_coords.x, start_coords.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    createDinamicDots(linesArray, start_coords, mouse);
    ctx.closePath();
  }
});

const createDots = (linesArray) => {
  if (linesArray.length >= 2) {
    for (let i = 0; i < linesArray.length; i++) {
      for (let j = i + 1; j < linesArray.length; j++) {
        let d1 =
          (linesArray[i].x2 * linesArray[i].y1 -
            linesArray[i].x1 * linesArray[i].y2) /
          (linesArray[i].x2 - linesArray[i].x1);
        let d2 =
          (linesArray[j].x2 * linesArray[j].y1 -
            linesArray[j].x1 * linesArray[j].y2) /
          (linesArray[j].x2 - linesArray[j].x1);
        let k1 =
          (linesArray[i].y2 - linesArray[i].y1) /
          (linesArray[i].x2 - linesArray[i].x1);
        let k2 =
          (linesArray[j].y2 - linesArray[j].y1) /
          (linesArray[j].x2 - linesArray[j].x1);
        let x = (d2 - d1) / (k1 - k2);
        let y = (k1 * (d2 - d1)) / (k1 - k2) + d1;
        if (
          ((x >= linesArray[i].x1 && x <= linesArray[i].x2) ||
            (x <= linesArray[i].x1 && x >= linesArray[i].x2)) &&
          ((x >= linesArray[j].x1 && x <= linesArray[j].x2) ||
            (x <= linesArray[j].x1 && x >= linesArray[j].x2)) &&
          ((y >= linesArray[i].y1 && y <= linesArray[i].y2) ||
            (y <= linesArray[i].y1 && y >= linesArray[i].y2)) &&
          ((y >= linesArray[j].y1 && y <= linesArray[j].y2) ||
            (y <= linesArray[j].y1 && y >= linesArray[j].y2))
        ) {
          drawCircle(x, y, 5, "#eb0000");
        }
      }
    }
  }
};

const createDinamicDots = (linesArray, start_coords, mouse) => {
  if (linesArray.length >= 1) {
    for (let i = 0; i < linesArray.length; i++) {
      let d1 =
        (linesArray[i].x2 * linesArray[i].y1 -
          linesArray[i].x1 * linesArray[i].y2) /
        (linesArray[i].x2 - linesArray[i].x1);
      let d2 =
        (mouse.x * start_coords.y - start_coords.x * mouse.y) /
        (mouse.x - start_coords.x);
      let k1 =
        (linesArray[i].y2 - linesArray[i].y1) /
        (linesArray[i].x2 - linesArray[i].x1);
      let k2 = (mouse.y - start_coords.y) / (mouse.x - start_coords.x);
      let x = (d2 - d1) / (k1 - k2);
      let y = (k1 * (d2 - d1)) / (k1 - k2) + d1;
      if (
        ((x >= linesArray[i].x1 && x <= linesArray[i].x2) ||
          (x <= linesArray[i].x1 && x >= linesArray[i].x2)) &&
        ((x >= start_coords.x && x <= mouse.x) ||
          (x <= start_coords.x && x >= mouse.x)) &&
        ((y >= linesArray[i].y1 && y <= linesArray[i].y2) ||
          (y <= linesArray[i].y1 && y >= linesArray[i].y2)) &&
        ((y >= start_coords.y && y <= mouse.y) ||
          (y <= start_coords.y && y >= mouse.y))
      ) {
        drawCircle(x, y, 5, "#eb0000");
      }
    }
  }
};

const drawCircle = (x, y, radius, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

collapseLinesBtn.addEventListener("click", () => {
  collapseLines();
});

const collapseLines = () => {
  const int = setInterval(() => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    linesArray.forEach((el) => {
      el.collapse();
      el.draw();
      createDots(linesArray);
    });
  }, 0);
  setTimeout(() => {
    clearInterval(int);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }, 3000);
};

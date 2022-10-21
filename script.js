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
    if (this.x1 - this.x2 > 1) {
      this.x1 = this.x1 - (this.x1 - this.x2) / 100;
      this.x2 = this.x2 + (this.x1 - this.x2) / 100;
      if (this.x1 - this.x2 <= 1) {
        this.x1 = 0;
        this.x2 = 0;
      }
    } else if (this.x2 - this.x1 > 1) {
      this.x1 = this.x1 + (this.x2 - this.x1) / 100;
      this.x2 = this.x2 - (this.x2 - this.x1) / 100;
      if (this.x2 - this.x1 <= 1) {
        this.x1 = 0;
        this.x2 = 0;
      }
    }

    if (this.y1 - this.y2 > 1) {
      this.y1 = this.y1 - (this.y1 - this.y2) / 100;
      this.y2 = this.y2 + (this.y1 - this.y2) / 100;
    } else if (this.y2 - this.y1 > 1) {
      this.y1 = this.y1 + (this.y2 - this.y1) / 100;
      this.y2 = this.y2 - (this.y2 - this.y1) / 100;
    }
  }
}

let arr = [];
let linesArray = [];

const createLine = (event) => {
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
};

canvas.addEventListener("click", createLine);

let draw = false;
let array = [];
let mouse = {};
let start_coords = {};
let resault_coords = {};

window.addEventListener("contextmenu", () => {
  draw = false;
  mouse = {};
  start_coords = {};
  resault_coords = {};
});

const startLine = (event) => {
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
};
canvas.addEventListener("mousedown", startLine);

const endLine = (event) => {
  if (draw) {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    linesArray.forEach((el) => {
      el.draw();
    });
    createDots(linesArray);
    // ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(start_coords.x, start_coords.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    createDinamicDots(linesArray, start_coords, mouse);
    ctx.closePath();
  }
};
canvas.addEventListener("mousemove", endLine);

const createDots = (linesArray) => {
  //щоб не було Infinity при визначенні коефіцієнтів,
  //якщо лінія горизонтальна і різниця координат дає нуль,
  //до дільника додав коефіцієнт похибки 0,001.

  let k = 1 / 1000;

  if (linesArray.length >= 2) {
    for (let i = 0; i < linesArray.length; i++) {
      for (let j = i + 1; j < linesArray.length; j++) {
        let d1 =
          (linesArray[i].x2 * linesArray[i].y1 -
            linesArray[i].x1 * linesArray[i].y2) /
          (linesArray[i].x2 - linesArray[i].x1 + k);
        let d2 =
          (linesArray[j].x2 * linesArray[j].y1 -
            linesArray[j].x1 * linesArray[j].y2) /
          (linesArray[j].x2 - linesArray[j].x1 + k);
        let k1 =
          (linesArray[i].y2 - linesArray[i].y1) /
          (linesArray[i].x2 - linesArray[i].x1 + k);
        let k2 =
          (linesArray[j].y2 - linesArray[j].y1) /
          (linesArray[j].x2 - linesArray[j].x1 + k);
        let x = Math.round((d2 - d1) / (k1 - k2));
        let y = Math.round((k1 * (d2 - d1)) / (k1 - k2) + d1);
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
  let k = 1 / 1000;

  if (linesArray.length >= 1) {
    for (let i = 0; i < linesArray.length; i++) {
      let d1 =
        (linesArray[i].x2 * linesArray[i].y1 -
          linesArray[i].x1 * linesArray[i].y2) /
        (linesArray[i].x2 - linesArray[i].x1 + k);
      let d2 =
        (mouse.x * start_coords.y - start_coords.x * mouse.y) /
        (mouse.x - start_coords.x + k);
      let k1 =
        (linesArray[i].y2 - linesArray[i].y1) /
        (linesArray[i].x2 - linesArray[i].x1 + k);
      let k2 = (mouse.y - start_coords.y) / (mouse.x - start_coords.x + k);
      let x = Math.round((d2 - d1) / (k1 - k2));
      let y = Math.round((k1 * (d2 - d1)) / (k1 - k2) + d1);
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
  let linesArrayClone = linesArray;

  // canvas.removeEventListener("click");

  canvas.removeEventListener("click", createLine);
  canvas.removeEventListener("mousedown", startLine);
  canvas.removeEventListener("mousemove", endLine);

  draw = false;
  mouse = {};
  start_coords = {};
  resault_coords = {};
  linesArray = [];
  array = [];
  arr = [];

  const int = setInterval(() => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    linesArrayClone.forEach((el) => {
      el.collapse();
      el.draw();
      createDots(linesArray);
    });
  }, 10);

  setTimeout(() => {
    canvas.addEventListener("click", createLine);
    canvas.addEventListener("mousedown", startLine);
    canvas.addEventListener("mousemove", endLine);

    clearInterval(int);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }, 3000);
};

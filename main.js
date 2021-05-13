let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generate = (size) => {
  let macierz = Array(size).fill(0);
  let dencity = 30;
  let amountMax = (dencity / 100) * ((size * size) / 2) * 0.9;
  console.log(amountMax);
  let amountCurrent = 0;
  macierz = macierz.map((a) => Array(size).fill(0));
  for (let index = 0; index < size; index++) {
    macierz[index][index - 1 < 0 ? size - 1 : index - 1] = 1;
    macierz[index - 1 < 0 ? size - 1 : index - 1][index] = 1;
    amountCurrent++;
  }
  while (amountCurrent < amountMax) {
    let x1, x2, y1, y2;
    while (true) {
      x1 = getRandomIntInclusive(0, size - 1);
      x2 = getRandomIntInclusive(0, size - 1);
      y1 = getRandomIntInclusive(0, size - 1);
      y2 = getRandomIntInclusive(0, size - 1);
      if (x1 == y1 || x2 == y2) continue;
      if (x1 == y2 || x2 == y1) continue;
      if (x1 == x2 || y1 == y2) continue;
      if (
        macierz[x1][y1] ||
        macierz[x1][y2] ||
        macierz[x2][y1] ||
        macierz[x2][y2]
      )
        continue;
      break;
    }
    macierz[x1][y1] = 1;
    macierz[x1][y2] = 1;
    macierz[x2][y1] = 1;
    macierz[x2][y2] = 1;

    macierz[y1][x1] = 1;
    macierz[y2][x1] = 1;
    macierz[y1][x2] = 1;
    macierz[y2][x2] = 1;

    amountCurrent += 8;
  }

  return macierz;
};
// console.table(generate30(10));
let shit = generate(20);
let lastTime = 0;
function setup(array) {
  let graph = [];
  for (let i = 0; i < shit.length; i++) {
    let node = {
      x: 250 + Math.sin((i / shit.length) * 2 * Math.PI) * 200,
      y: 250 + Math.cos((i / shit.length) * 2 * Math.PI) * 200,
      connections: [],
    };
    for (let j = 0; j < i; j++) {
      if (shit[i][j]) {
        node.connections.push(graph[j]);
      }
    }
    graph.push(node);
  }
  return graph;
}

let toDraw = setup(shit);

function draw(timeStamp) {
  ctx.clearRect(0, 0, 800, 800);
  ctx.strokeStyle = "blue";
  let delta = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;
  for (let i = 0; i < toDraw.length; i++) {
    for (let j = 0; j < toDraw[i].connections.length; j++) {
      ctx.beginPath();

      ctx.moveTo(toDraw[i].x, toDraw[i].y);
      ctx.lineTo(toDraw[i].connections[j].x, toDraw[i].connections[j].y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(toDraw[i].x, toDraw[i].y, 30, 0, 2 * Math.PI);
    ctx.stroke();
  }
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

let draging;

canvas.addEventListener("mousedown", mouseClick);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);
function mouseClick(e) {
  for (let i = 0; i < toDraw.length; i++) {
    const element = toDraw[i];
    if (
      Math.abs(e.offsetX - element.x) < 25 &&
      Math.abs(e.offsetY - element.y) < 25
    ) {
      draging = element;
    }
  }
}
function mouseMove(e) {
  if (draging) {
    draging.x = e.offsetX;
    draging.y = e.offsetY;
  }
}

function mouseUp(e) {
  if (draging) {
    draging = null;
  }
}

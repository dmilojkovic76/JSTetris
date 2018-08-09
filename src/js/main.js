const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const startStop = document.querySelector('#start_stop');

const scaleFactor = 20;

const fieldWidth = 10;
const fieldHeight = 20;

const color = [
  null,
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#ffff2d',
  '#05cbdb',
  '#bf00bf',
  '#ff9900'
];

context.scale(scaleFactor, scaleFactor);

function collide(gameField, player){
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y){
    for (let x = 0; x < m[y].length; ++x){
      if (m[y][x] !== 0 && (gameField.matrix[y + o.y] && gameField.matrix[y + o.y][x + o.x ]) !== 0){
        return true;
      }
    }
  }
  return false;
}

function createPeace(type){
  if (type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ];
  } else if (type === 'O'){
    return [
      [2, 2],
      [2, 2]
    ];
  } else if (type === 'L'){
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3]
    ];
  }else if (type === 'J'){
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0]
    ];
  }else if (type ==='I'){
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0]
    ];
  }else if (type === 'S'){
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0]
    ];
  }else if (type === 'Z'){
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ];
  }
}

function draw(){
  context.fillStyle = '#234';
  const bgWidth = canvas.width / scaleFactor;
  const bgHeight = canvas.height / scaleFactor;
  context.fillRect(0, 0, bgWidth, bgHeight);

  drawMatrix(gameField.matrix, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);

  if (player.playing === 0){
    showPauseScreen();
  }
}


function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = color[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function gamePlayPause() {
  player.playing = (player.playing === 0 ? 1 : 0);
  startStop.innerHTML = (player.playing === 0 ? 'START' : 'STOP');
}

function merge(gameField, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0){
        gameField.matrix[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function randomPiece(){
  const pieces = 'TOLJISZ';
  return pieces[pieces.length * Math.random() | 0];  // eslint-disable-line
}

function restartGame(){
  gameField.clear();
  player.score = 0;
  player.playing = 1;
  player.gameOver = 0;
}

function showPauseScreen() {
  context.fillStyle = '#012';
  const bgWidth = canvas.width / scaleFactor;
  const bgHeight = canvas.height / scaleFactor;
  context.fillRect(0, 0, bgWidth, bgHeight);
  const polaSirine = bgWidth / 2;
  const polaVisine = bgHeight / 2;
  context.fillStyle = '#88A';
  context.fillRect(polaSirine*0.7, polaVisine*0.75, polaSirine*0.2, polaVisine*0.5);
  context.fillRect(polaSirine*1.1, polaVisine*0.75, polaSirine*0.2, polaVisine*0.5);
  context.scale(1 / scaleFactor, 1 / scaleFactor);
  const fontSize = 30;
  context.font = `bold ${fontSize}px Arial`;
  context.fillStyle = 'red';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME', canvas.width / 2, canvas.height / 2 - fontSize*0.75);
  if (player.gameOver){
    context.fillText('OVER', canvas.width / 2, canvas.height / 2 + fontSize*0.75);
  } else if (player.gameOver === 0){
    context.fillText('PAUSED', canvas.width / 2, canvas.height / 2 + fontSize*0.75);
  }
  context.scale(scaleFactor, scaleFactor);
}

let lastTime = 0;

function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;

  player.update(deltaTime);

  draw();
  requestAnimationFrame(update);
}

function updateScore(){
  document.querySelector('#score strong').innerText = player.score;
  document.querySelector('#level strong').innerText = player.level;
}

const gameField = new GameField(fieldWidth, fieldHeight);// eslint-disable-line
const player = new Player(); // eslint-disable-line

document.addEventListener('keydown', event => {
  if(event.key === 'ArrowLeft') {
    player.move(-1);
  } else if(event.key === 'ArrowRight'){
    player.move(1);
  } else if(event.key === 'ArrowUp'){
    player.rotate(-1);
  } else if(event.key === 'ArrowDown'){
    player.drop();
  } else if(event.key === ' '){
    gamePlayPause();
  }
});

startStop.addEventListener('mousedown', () => {
  gamePlayPause();

  if (player.gameOver){
    restartGame();
    player.reset();
    updateScore();
  }
});


updateScore();
player.reset();

update();

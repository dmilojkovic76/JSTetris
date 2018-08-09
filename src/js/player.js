/* eslint-disable */
class Player {
  constructor(){
    this.pos = {x: 0, y: 0};
    this.matrix = null;
    this.score = 0;
    this.level = 1;
    this.playing = 0;
    this.gameOver = 1;
    this.dropCounter = 0;
    this.levelUpCounter = 0;
    this.dropInterval = 1000;
  }

  drop(){
    this.pos.y++;
    if(collide(gameField, this)){
      this.pos.y--;
      merge(gameField, this);
      gameField.sweep();
      updateScore();
      this.reset();
      if (collide(gameField, this)){
        this.playing = 0;
        this.gameOver = 1;
        startStop.innerHTML = 'RESTART';
      }
    }
    this.dropCounter = 0;
  }

  move(dir){
    this.pos.x += dir;
    if (collide(gameField, this)){
      this.pos.x -= dir;
    }
  }

  reset(){
    this.matrix = createPeace(randomPiece());
    this.pos.y = 0;
    this.pos.x = (gameField.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0 ); // eslint-disable-line
  }

  rotate(dir){
    const pos = this.pos.x;
    let offset = 1;
    this.rotateMatrix(this.matrix, dir);
    while (collide(gameField, this)){
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length){
        this.rotateMatrix(this.matrix, -dir);
        this.pos.x = pos;
        return;
      }
    }
  }

  rotateMatrix(matrix, dir){
    for (let y = 0; y < matrix.length; ++y){
      for (let x = 0; x < y; ++x){
        [
          matrix[x][y],
          matrix[y][x]
        ] = [
          matrix[y][x],
          matrix[x][y]
        ];
      }
    }

    if (dir > 0){
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  update(deltaTime){
    if (this.playing){
      this.dropCounter += deltaTime;
      if(this.dropCounter > this.dropInterval) {
        this.drop();
      }
    }
  }

}

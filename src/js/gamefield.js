/* eslint-disable */
class GameField {

  constructor(w, h){
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    this.matrix = matrix;
  }

  clear(){
    this.matrix.forEach(row => row.fill(0));
  }

  sweep(){
    let rowCount = 1;
    for(let y = this.matrix.length - 1; y > 0; --y){

      let rowFull = 1;
      for(let x = 0; x < this.matrix[y].length; ++x){
        if(this.matrix[y][x] === 0){
          rowFull = 0;
          break;
        }
      }

      if (rowFull){
        const row = this.matrix.splice(y,1)[0].fill(0);
        this.matrix.unshift(row);
        y++;

        player.score += rowCount * 10;
        rowCount *= 2;
        player.levelUpCounter++;
        if (player.levelUpCounter >= 10){
          player.level++;
          player.dropInterval = player.dropInterval * 0.75;
          player.levelUpCounter = 0;
        }
      }

    }
  }

}

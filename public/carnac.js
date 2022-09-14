console.log("ehll");
class Player {
    constructor()
    {
        this.id = null
    }
}

class Carnac {
    constructor()
    {
        this.board = []
        this.boardWidth = 10;
        this.boardHeight = 7;
        this.firstPlayer = new Player()
        this.secondPlayer = new Player()
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            console.log(this.board);
            for (let x = 0; x < this.boardWidth; x++) {
              this.board[y].push(null);
            }
          }
    }

    isEmpty()
    {
        return this.firstPlayer.id === null && this.secondPlayer.id === null;
    }

    hasFreePlayer()
    {
        return this.firstPlayer.id === null || this.secondPlayer.id === null;
    }
}
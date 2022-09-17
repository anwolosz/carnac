class Player {
    constructor() {
        this.id = null
    }
}

class Carnac {
    constructor(roomName) {
        this.roomName = roomName
        this.board = []
        this.boardWidth = 10;
        this.boardHeight = 7;
        this.firstPlayer = new Player()
        this.secondPlayer = new Player()
        this.activePlayer = null
        this.winner = new Player()
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(null);
            }
        }
    }

    move(y, x, player) {
        if (this.isLegalMove(y, x, player)) {
            console.log("Move is legal!");
            console.log("Active player: ", this.activePlayer);
            this.placeStone(y, x);
            console.log(this.board);
            //   this.lastMove = [y, x];
            //   if (this.isWin(x, y)) {
            //     this.winner = this.activePlayer;
            //     console.log(`End of Game. Winner is ${this.activePlayer}`);
            //     return true;
            //   }
            //   console.log(this.board[0]);
            //   this.noteMove(x, y);
            this.switchPlayer();
            console.log("Next player: ", this.activePlayer);
            return true;
        } else {
            console.log(player);
            console.log(this.activePlayer);
            console.log("Move is illlegal...");
            return false;
        }
    }

    switchPlayer() {
        if (this.activePlayer === this.firstPlayer.id) {
            this.activePlayer = this.secondPlayer.id;
        } else {
            this.activePlayer = this.firstPlayer.id;
        }
    }

    isLegalMove(y, x, player) {
        console.log("!!!!!!!!!!", player, this.activePlayer);
        return (
            this.winner.id === null &&
            this.activePlayer === player &&
            !this.isOutOfBounds(y, x) && 
            this.board[y][x] !== "X"
        );
    }

    isOutOfBounds(x, y) {
        return x >= this.boardWidth || y >= this.boardHeight || x < 0 || y < 0;
    }


    isEmpty() {
        return this.firstPlayer.id === null && this.secondPlayer.id === null;
    }

    hasFreePlayer() {
        return this.firstPlayer.id === null || this.secondPlayer.id === null;
    }


    removeShadows() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x] === "WS" || this.board[y][x] === "ES" || this.board[y][x] === "NS" || this.board[y][x] === "SS" || this.board[y][x] === "S") {
                    this.board[y][x] = null;
                }
            }
        }
    }

    setShadows(y, x) {

        this.removeShadows()

        if (this.board[y][x] === "X") {
            return
        }


        this.board[y][x] = "S"

        if (x - 1 >= 0 && x - 2 >= 0 && this.board[y][x - 1] != "X" && this.board[y][x - 2] != "X") {
            this.board[y][x - 1] = "WS"
            this.board[y][x - 2] = "WS"

        }
        if (x + 1 < this.boardWidth && x + 2 < this.boardWidth && this.board[y][x + 1] != "X" && this.board[y][x + 2] != "X") {
            this.board[y][x + 1] = "ES"
            this.board[y][x + 2] = "ES"

        }
        if (y - 1 >= 0 && y - 2 >= 0 && this.board[y - 1][x] != "X" && this.board[y - 2][x] != "X") {
            this.board[y - 1][x] = "NS"
            this.board[y - 2][x] = "NS"

        }
        if (y + 1 < this.boardHeight && y + 2 < this.boardHeight && this.board[y + 1][x] != "X" && this.board[y + 2][x] != "X") {
            this.board[y + 1][x] = "SS"
            this.board[y + 2][x] = "SS"

        }
    }

    placeStone(y, x) {

        this.board[y][x] = "X";
    }
}

module.exports = Carnac;
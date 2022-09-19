class Player {
    constructor() {
        this.id = null
        this.status = null
    }
}

class Cell {
    constructor() {
        this.stone = null
        this.unplacedStone = null
        this.shadow = null

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
        this.activePlayer = new Player()
        this.winner = new Player()
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(null);
            }
        }
    }


    isLegalTip(y, x, player) {
        return (
            this.winner.id === null &&
            this.activePlayer.id === player &&
            !this.isOutOfBounds(y, x) &&
            (this.board[y][x] === "WW" || this.board[y][x] === "WR" || this.board[y][x] === "EW" || this.board[y][x] === "ER" ||
                this.board[y][x] === "NW" || this.board[y][x] === "NR" || this.board[y][x] === "SW" || this.board[y][x] === "SR")
        );
    }

    move(y, x, player) {

        console.log("helloASDASFASD");
        if (this.activePlayer.status === "TIP_OR_PASS") {
            if (this.isLegalTip(y, x, player)) {
                let tipSymbol = this.board[y][x]
                for (let y1 = 0; y1 < this.boardHeight; y1++) {
                    for (let x1 = 0; x1 < this.boardWidth; x1++) {
                        console.log(this.board[y][x]);
                        console.log(this.board[y1][x1]);
                        if (this.board[y1][x1] === tipSymbol) {
                            this.board[y1][x1] = "X"
                        }
                    }
                }

                this.activePlayer.status = "PLACE_STONE";
            }
        }

        if (this.activePlayer.status === "PLACE_STONE") {
            if (this.isLegalPlace(y, x, player)) {
                console.log("Move is legal!");
                console.log("Active player: ", this.activePlayer.id);
                this.placeStone(y, x, "ST1");
                console.log(this.board);
                //   this.lastMove = [y, x];
                //   if (this.isWin(x, y)) {
                //     this.winner = this.activePlayer.id;
                //     console.log(`End of Game. Winner is ${this.activePlayer.id}`);
                //     return true;
                //   }
                //   console.log(this.board[0]);
                //   this.noteMove(x, y);
                this.switchPlayer();
                console.log("Next player: ", this.activePlayer.id);
                return true;
            } else {
                console.log(player);
                console.log(this.activePlayer.id);
                console.log("Move is illlegal...");
                return false;
            }
        }
    }

    switchPlayer() {
        if (this.activePlayer.id === this.firstPlayer.id) {
            this.activePlayer.id = this.secondPlayer.id;
        } else {
            this.activePlayer.id = this.firstPlayer.id;
        }
        this.activePlayer.status = "TIP_OR_PASS"
    }

    isPassAllowed() {
        // If there is no cell with shadow
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x] === "WW" || this.board[y][x] === "WR" || this.board[y][x] === "EW" || this.board[y][x] === "ER" ||
                    this.board[y][x] === "NW" || this.board[y][x] === "NR" || this.board[y][x] === "SW" || this.board[y][x] === "SR") {
                    return true;
                }
            }
        }
        return false;
    }

    isLegalPlace(y, x, player) {
        return (
            this.winner.id === null &&
            this.activePlayer.id === player &&
            !this.isOutOfBounds(y, x) &&
            this.board[y][x] !== "X"
        );
    }

    isOutOfBounds(y, x) {
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

    placeStone(y, x, stone) {

        let horizontalSymbol = "R";
        let verticalSymbol = "W";
        if (stone === "ST1" || stone === "ST2") {
            horizontalSymbol = "W";
            verticalSymbol = "R";
        }

        this.board[y][x] = "X";

        if (x - 1 >= 0 && x - 2 >= 0 && this.board[y][x - 1] != "X" && this.board[y][x - 2] != "X") {
            this.board[y][x - 1] = "W" + horizontalSymbol
            this.board[y][x - 2] = "W" + horizontalSymbol

        }
        if (x + 1 < this.boardWidth && x + 2 < this.boardWidth && this.board[y][x + 1] != "X" && this.board[y][x + 2] != "X") {
            this.board[y][x + 1] = "E" + horizontalSymbol
            this.board[y][x + 2] = "E" + horizontalSymbol

        }
        if (y - 1 >= 0 && y - 2 >= 0 && this.board[y - 1][x] != "X" && this.board[y - 2][x] != "X") {
            this.board[y - 1][x] = "N" + verticalSymbol
            this.board[y - 2][x] = "N" + verticalSymbol

        }
        if (y + 1 < this.boardHeight && y + 2 < this.boardHeight && this.board[y + 1][x] != "X" && this.board[y + 2][x] != "X") {
            this.board[y + 1][x] = "S" + verticalSymbol
            this.board[y + 2][x] = "S" + verticalSymbol

        }
    }
}

class Player {
    constructor() {
        this.id = null
        this.status = null
    }
}

class Cell {
    constructor() {
        this.color = null // W / R
        this.type = null // FIXED / PLACED / SHADOW
        this.direction = null // W / E / N / S
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
        this.stoneCounter = 28;
        this.selectedStone = "STONE_1"
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(new Cell());
            }
        }
    }


    isLegalTip(y, x, player) {
        return (
            this.winner.id === null &&
            this.activePlayer.id === player &&
            !this.isOutOfBounds(y, x) &&
            (this.board[y][x].type === "SHADOW")
        );
    }

    pass(player)
    {
        console.log(this.activePlayer.status);
        if (this.activePlayer.status === "TIP_OR_PASS")
        {
            console.log("itetete");
            console.log(this.activePlayer.id, player);
            if (this.isLegalPass(player))
            {
                console.log("TEST");
                for (let y = 0; y < this.boardHeight; y++) {
                    for (let x = 0; x < this.boardWidth; x++) {
                        if (this.board[y][x].type === "PLACED") {
                            this.board[y][x].type = "FIXED";
                            break;
                        }
                    }
                }
                this.removeOptions();
                if (this.stoneCounter <= 0) {
                    this.winner = "NOTNUL";
                }
                this.switchPlayer();
                this.activePlayer.status = "PLACE_STONE";
                return true;
            }
            else {
                return false;
            }
        }
    }

    move(y, x, stone, player) {

        console.log("helloASDASFASD");
        if (this.activePlayer.status === "TIP_OR_PASS") {
            if (this.isLegalTip(y, x, player)) {
                let tipSymbol = this.board[y][x].direction
                for (let y1 = 0; y1 < this.boardHeight; y1++) {
                    for (let x1 = 0; x1 < this.boardWidth; x1++) {
                        console.log(this.board[y][x]);
                        console.log(this.board[y1][x1]);
                        if (this.board[y1][x1].direction === tipSymbol) {
                            this.board[y1][x1].type = "FIXED"
                        }
                    }
                }
                this.removeOptions();
                if (this.stoneCounter <= 0) {
                    this.winner = "NOTNUL";
                }
                this.activePlayer.status = "PLACE_STONE";
                return true;
            }
            else {
                console.log(player);
                console.log(this.activePlayer.id);
                console.log("Move is illlegal...");
                return false;
            }
        }

        if (this.activePlayer.status === "PLACE_STONE") {
            if (this.isLegalPlace(y, x, player)) {
                this.selectedStone = stone;
                console.log("Move is legal!");
                console.log("Active player: ", this.activePlayer.id);
                this.placeStone(y, x);
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
                this.stoneCounter--;
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

    isLegalPass(player)
    {
        return (
        this.winner.id === null &&
        this.activePlayer.id === player
        )
    }

    // isPassAllowed() {
    //     // If there is no cell with shadow
    //     for (let y = 0; y < this.boardHeight; y++) {
    //         for (let x = 0; x < this.boardWidth; x++) {
    //             if (this.board[y][x].type === "SHADOW") {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    isLegalPlace(y, x, player) {
        return (
            this.winner.id === null &&
            this.activePlayer.id === player &&
            !this.isOutOfBounds(y, x) &&
            this.board[y][x].type !== "FIXED"
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



    removeOptions() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].type === "SHADOW" || this.board[y][x].type === "PLACED") {
                    this.board[y][x] = new Cell();
                }
            }
        }
    }


    placeStone(y, x) {


        this.removeOptions()

        if (this.board[y][x].type === "FIXED" || this.winner.id !== null) {
            return
        }

        let horizontalSymbol = "R";
        let verticalSymbol = "W";
        if (this.selectedStone === "STONE_1" || this.selectedStone === "STONE_2") {
            horizontalSymbol = "W";
            verticalSymbol = "R";
        }

        if (this.board[y][x].type !== "FIXED") {
            this.board[y][x].type = "PLACED";
        }
        
        this.board[y][x].color = "W";
        if (this.selectedStone === "STONE_1" || this.selectedStone === "STONE_4")
        {
            this.board[y][x].color = "R";
        }

        if (x - 1 >= 0 && x - 2 >= 0 && this.board[y][x - 1].type != "FIXED" && this.board[y][x - 2].type != "FIXED") {
            this.board[y][x - 1].color = horizontalSymbol
            this.board[y][x - 1].direction = "W"
            this.board[y][x - 1].type = "SHADOW"

            this.board[y][x - 2].color = horizontalSymbol
            this.board[y][x - 2].direction = "W"
            this.board[y][x - 2].type = "SHADOW"

        }
        if (x + 1 < this.boardWidth && x + 2 < this.boardWidth && this.board[y][x + 1].type != "FIXED" && this.board[y][x + 2].type != "FIXED") {
            this.board[y][x + 1].color = horizontalSymbol
            this.board[y][x + 1].direction = "E"
            this.board[y][x + 1].type = "SHADOW"

            this.board[y][x + 2].color = horizontalSymbol
            this.board[y][x + 2].direction = "E"
            this.board[y][x + 2].type = "SHADOW"

        }
        if (y - 1 >= 0 && y - 2 >= 0 && this.board[y - 1][x].type != "FIXED" && this.board[y - 2][x].type != "FIXED") {
            this.board[y - 1][x].color = verticalSymbol
            this.board[y - 1][x].direction = "N"
            this.board[y - 1][x].type = "SHADOW"

            this.board[y - 2][x].color = verticalSymbol
            this.board[y - 2][x].direction = "N"
            this.board[y - 2][x].type = "SHADOW"

        }
        if (y + 1 < this.boardHeight && y + 2 < this.boardHeight && this.board[y + 1][x].type != "FIXED" && this.board[y + 2][x].type != "FIXED") {
            this.board[y + 1][x].color = verticalSymbol
            this.board[y + 1][x].direction = "S"
            this.board[y + 1][x].type = "SHADOW"

            this.board[y + 2][x].color = verticalSymbol
            this.board[y + 2][x].direction = "S"
            this.board[y + 2][x].type = "SHADOW"

        }
    }
}

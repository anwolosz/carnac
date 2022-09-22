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
        this.counted = false;
        this.partOfDolmen = false;
    }
}

class Carnac {
    constructor(roomName) {
        this.gameStatus = "WAITING"
        this.roomName = roomName
        this.board = []
        this.boardWidth = 10;
        this.boardHeight = 7;
        this.firstPlayer = new Player()
        this.secondPlayer = new Player()
        this.activePlayer = new Player()
        this.winner = null
        this.stoneCounter = 3;
        this.selectedStone = "STONE_1"
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(new Cell());
            }
        }
    }

    countEmptyCells() {
        let counter = 0;
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].type !== "FIXED") {
                    counter++;
                }
            }
        }
        return counter;
    }



    countDolmen() {
        let redCounter = 0;
        let whiteCounter = 0;
        let dolmenStarterPoints = [];
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].color === "R" && this.board[y][x].counted === false) {
                    if (this.countStonesInDolmen(y, x, 0, "R") >= 3) {
                        redCounter++;
                        dolmenStarterPoints.push([y, x])
                    }
                }
                if (this.board[y][x].color === "W" && this.board[y][x].counted === false) {
                    if (this.countStonesInDolmen(y, x, 0, "W") >= 3) {
                        whiteCounter++;
                        dolmenStarterPoints.push([y, x])
                    }
                }
            }
        }
        for (let i = 0; i < dolmenStarterPoints.length; i++) {
            let y_ = dolmenStarterPoints[i][0]
            let x_ = dolmenStarterPoints[i][1]
            this.fillDolmen(y_, x_, this.board[y_][x_].color)
            console.log(dolmenStarterPoints[i]);
        }
        console.log("RED:", redCounter, " WHITE:", whiteCounter);
        return [redCounter, whiteCounter];

    }

    fillDolmen(y, x, color) {
        if (this.isOutOfBounds(y, x) || this.board[y][x].color !== color || (this.board[y][x].color === color && this.board[y][x].partOfDolmen)) {
            return;
        }
        this.board[y][x].partOfDolmen = true;
        this.fillDolmen(y + 1, x, color);
        this.fillDolmen(y - 1, x, color);
        this.fillDolmen(y, x + 1, color);
        this.fillDolmen(y, x - 1, color);
    }

    countStonesInDolmen(y, x, counter, color) {

        if (this.isOutOfBounds(y, x) || this.board[y][x].color !== color || (this.board[y][x].color === color && this.board[y][x].counted)) {
            return counter;
        }
        counter++;
        this.board[y][x].counted = true;
        counter = this.countStonesInDolmen(y + 1, x, counter, color);
        counter = this.countStonesInDolmen(y - 1, x, counter, color);
        counter = this.countStonesInDolmen(y, x + 1, counter, color);
        counter = this.countStonesInDolmen(y, x - 1, counter, color);
        return counter;
    }

    checkWin() {
        if (this.stoneCounter <= 0 || this.countEmptyCells() === 0) {
            console.log("GAME END2");
            let results = this.countDolmen();
            if (results[0] > results[1]) {
                this.winner = this.firstPlayer.id;
            }
            else if (results[0] === results[1]) {
                this.winner = "DRAW"
            }
            else {
                this.winner = this.secondPlayer.id
            }
            this.gameStatus = "GAME_OVER"
        }
    }

    pass(player) {
        console.log(this.activePlayer.status);
        if (this.isLegalAction(player) && this.isLegalPass()) {
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
            this.checkWin()
            this.switchPlayer();
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

    move(y, x, stone, player) {

        console.log("helloASDASFASD");
        if (this.isLegalAction(player) && this.isLegalTip(y, x)) {
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
            this.checkWin();
            this.activePlayer.status = "PLACE_STONE";
            return true;
        }

        else if (this.isLegalAction(player) && this.isLegalPlace(y, x)) {
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

    switchPlayer() {
        if (this.activePlayer.id === this.firstPlayer.id) {
            this.activePlayer.id = this.secondPlayer.id;
        } else {
            this.activePlayer.id = this.firstPlayer.id;
        }
        this.activePlayer.status = "TIP_OR_PASS"
    }

    isLegalAction(player) {
        return (
            this.gameStatus === "PLAYING" &&
            this.activePlayer.id === player
        );
    }

    isLegalPass() {
        return (
            this.activePlayer.status === "TIP_OR_PASS"
        )
    }

    isLegalTip(y, x) {
        return (
            this.activePlayer.status === "TIP_OR_PASS" &&
            !this.isOutOfBounds(y, x) &&
            (this.board[y][x].type === "SHADOW")
        );
    }

    isLegalPlace(y, x) {
        return (
            this.activePlayer.status === "PLACE_STONE" &&
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

        if (this.board[y][x].type === "FIXED" || this.winner !== null) {
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
        if (this.selectedStone === "STONE_1" || this.selectedStone === "STONE_4") {
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

module.exports = Carnac;

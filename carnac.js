class Player {
    constructor(timer) {
        this.id = null
        this.status = null // PLACE_STONE / TIP_OR_PASS / PASS_OR_PLACE
        this.timer = timer
    }
}

class Cell {
    constructor() {
        this.color = null // W / R 
        this.type = null // FIXED / PLACED / SHADOW / CURSOR
        this.direction = null // W / E / N / S
        this.counted = false;
        this.partOfDolmen = false;
    }
}

class Carnac {
    constructor(roomName, boardWidth, boardHeight, creatorColor, timer) {
        this.creatorColor = creatorColor
        this.gameStatus = "WAITING"
        this.roomName = roomName
        this.board = []
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.firstPlayer = new Player(timer)
        this.secondPlayer = new Player(timer)
        this.activePlayer = new Player(timer)
        this.winner = null
        this.stoneCounter = 28;
        this.selectedStone = "STONE_1"
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(new Cell());
            }
        }
    }

    countDown() {
        var startedAt = Date.now();
        var counter = setInterval(() => {
          if (this.activePlayer.id === this.firstPlayer.id) {
            this.firstPlayer.timer =
            this.firstPlayer.timer - (Date.now() - startedAt) /1000;
          } else {
            this.secondPlayer.timer =
            this.secondPlayer.timer -(Date.now() - startedAt) / 1000;
          }
    
          if (this.firstPlayer.timer <= 0) {
            this.firstPlayer.timer = 0;
            this.winner = this.secondPlayer.id;
            this.gameStatus = "GAME_OVER"
            clearInterval(counter);
          }
          if (this.secondPlayer.timer <= 0) {
            this.secondPlayer.timer = 0;
            this.winner = this.firstPlayer.id;
            this.gameStatus = "GAME_OVER"
            clearInterval(counter);
          }
          if (this.winner !== null) {
            clearInterval(counter);
          }
          startedAt = Date.now()
        }, 100);
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
        let sizeOfRedDolmens = [];
        let sizeOfWhiteDolmens = [];
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].color === "R" && this.board[y][x].counted === false) {
                    let numberOfRedStones = this.countStonesInDolmen(y, x, 0, "R")
                    if (numberOfRedStones >= 3) {
                        redCounter++;
                        dolmenStarterPoints.push([y, x])
                        sizeOfRedDolmens.push(numberOfRedStones)
                    }
                }
                if (this.board[y][x].color === "W" && this.board[y][x].counted === false) {
                    let numberOfWhiteStones = this.countStonesInDolmen(y, x, 0, "W")
                    if (numberOfWhiteStones >= 3) {
                        whiteCounter++;
                        dolmenStarterPoints.push([y, x])
                        sizeOfWhiteDolmens.push(numberOfWhiteStones)
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
        
        let largest = null;
        if (sizeOfRedDolmens.length == sizeOfWhiteDolmens.length)
        {
            sizeOfRedDolmens = new Uint8Array(sizeOfRedDolmens);
            sizeOfWhiteDolmens = new Uint8Array(sizeOfWhiteDolmens);
            console.log(sizeOfRedDolmens);
            console.log(sizeOfWhiteDolmens);
            sizeOfRedDolmens.sort().reverse()
            sizeOfWhiteDolmens.sort().reverse()

            for (let i = 0; i< sizeOfRedDolmens.length; i++)
            {
                if (sizeOfRedDolmens[i] > sizeOfWhiteDolmens[i])
                {
                    largest = "RED"
                    break;
                }
                if (sizeOfRedDolmens[i] < sizeOfWhiteDolmens[i])
                {
                    largest = "WHITE"
                    break;
                }
            }

        }
        console.log("RED:", redCounter, " WHITE:", whiteCounter);
        console.log(largest);
        return [redCounter, whiteCounter, largest];

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
            if (results[0] > results[1] || results[2] === "RED") {
                this.winner = this.firstPlayer.id;
            }
            else if (results[0] < results[1] || results[2] === "WHITE") {
                this.winner = this.secondPlayer.id
            }
            else {
                this.winner = "DRAW"
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
            for (let y = 0; y < this.boardHeight; y++) {
                for (let x = 0; x < this.boardWidth; x++) {
                    if (this.board[y][x].type === "PLACED") {
                        this.board[y][x].type = "FIXED";
                        break;
                    }
                }
            }
            this.placeStone(y, x, false);
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
            if (this.countShadows() !== 0)
            {
                this.activePlayer.status = "TIP_OR_PASS"
            }
            else {
                this.activePlayer.status = "PASS_OR_PLACE"
            }
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
    }

    isLegalAction(player) {
        return (
            this.gameStatus === "PLAYING" &&
            this.activePlayer.id === player
        );
    }

    isLegalPass() {
        return (
            this.activePlayer.status === "TIP_OR_PASS" || this.activePlayer.status === "PASS_OR_PLACE"
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
            (this.activePlayer.status === "PLACE_STONE" || this.activePlayer.status === "PASS_OR_PLACE") &&
            !this.isOutOfBounds(y, x) &&
            this.board[y][x].type !== "FIXED" &&
            this.board[y][x].type !== "PLACED"
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

    countShadows() {
        let counter = 0;
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].type === "SHADOW") {
                    counter++;
                }
            }
        }
        return counter;
    }

    removeOptions() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x].type === "SHADOW" || (this.board[y][x].type === "PLACED" && this.activePlayer.status !== "PASS_OR_PLACE") || this.board[y][x].type === "CURSOR") {
                    this.board[y][x] = new Cell();
                }
            }
        }
    }


    placeStone(y, x, isCursor) {


        this.removeOptions()

        if (this.board[y][x].type === "FIXED" ||this.board[y][x].type === "PLACED" || this.winner !== null) {
            return
        }

        let horizontalSymbol = "R";
        let verticalSymbol = "W";
        if (this.selectedStone === "STONE_1" || this.selectedStone === "STONE_2") {
            horizontalSymbol = "W";
            verticalSymbol = "R";
        }

        if (!isCursor) {
            this.board[y][x].type = "PLACED";
        }
        else {
            this.board[y][x].type = "CURSOR";
        }

        this.board[y][x].color = "W";
        if (this.selectedStone === "STONE_1" || this.selectedStone === "STONE_4") {
            this.board[y][x].color = "R";
        }

        if (x - 1 >= 0 && x - 2 >= 0 && this.board[y][x - 1].type != "FIXED" && this.board[y][x - 2].type != "FIXED" && this.board[y][x - 1].type != "PLACED" && this.board[y][x - 2].type != "PLACED") {
            this.board[y][x - 1].color = horizontalSymbol
            this.board[y][x - 1].direction = "W"
            this.board[y][x - 1].type = "SHADOW"

            this.board[y][x - 2].color = horizontalSymbol
            this.board[y][x - 2].direction = "W"
            this.board[y][x - 2].type = "SHADOW"

        }
        if (x + 1 < this.boardWidth && x + 2 < this.boardWidth && this.board[y][x + 1].type != "FIXED" && this.board[y][x + 2].type != "FIXED" && this.board[y][x + 1].type != "PLACED" && this.board[y][x + 2].type != "PLACED") {
            this.board[y][x + 1].color = horizontalSymbol
            this.board[y][x + 1].direction = "E"
            this.board[y][x + 1].type = "SHADOW"

            this.board[y][x + 2].color = horizontalSymbol
            this.board[y][x + 2].direction = "E"
            this.board[y][x + 2].type = "SHADOW"

        }
        if (y - 1 >= 0 && y - 2 >= 0 && this.board[y - 1][x].type != "FIXED" && this.board[y - 2][x].type != "FIXED" && this.board[y - 1][x].type != "PLACED" && this.board[y - 2][x].type != "PLACED") {
            this.board[y - 1][x].color = verticalSymbol
            this.board[y - 1][x].direction = "N"
            this.board[y - 1][x].type = "SHADOW"

            this.board[y - 2][x].color = verticalSymbol
            this.board[y - 2][x].direction = "N"
            this.board[y - 2][x].type = "SHADOW"

        }
        if (y + 1 < this.boardHeight && y + 2 < this.boardHeight && this.board[y + 1][x].type != "FIXED" && this.board[y + 2][x].type != "FIXED" && this.board[y + 1][x].type != "PLACED" && this.board[y + 2][x].type != "PLACED") {
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

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
        for (let y = 0; y < this.boardHeight; y++) {
            this.board.push([]);
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y].push(null);
            }
        }
    }

    isEmpty() {
        return this.firstPlayer.id === null && this.secondPlayer.id === null;
    }

    hasFreePlayer() {
        return this.firstPlayer.id === null || this.secondPlayer.id === null;
    }

    getShadows(y, x) {
        let shadows = []
        if (x - 1 >= 0 && x - 2 >= 0 && this.board[y][x - 1] != "X" && this.board[y][x - 2] != "X") {
            shadows.push([y, x - 1], [y, x - 2])
        }
        if (x + 1 < this.boardWidth && x + 2 < this.boardWidth && this.board[y][x + 1] != "X" && this.board[y][x + 2] != "X") {
            shadows.push([y, x + 1], [y, x + 2])
        }
        if (y - 1 >= 0 && y - 2 >= 0 && this.board[y - 1][x] != "X" && this.board[y - 2][x] != "X") {
            shadows.push([y - 1, x], [y - 2, x])
        }
        if (y + 1 < this.boardHeight && y + 2 < this.boardHeight && this.board[y + 1][x] != "X" && this.board[y + 2][x] != "X") {
            shadows.push([y + 1, x], [y + 2, x])
        }
        return shadows;
    }
}

module.exports = Carnac;
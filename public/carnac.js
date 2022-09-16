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


    removeShadows()
    {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x] === "WS" || this.board[y][x] === "ES" || this.board[y][x] === "NS" || this.board[y][x] === "SS" || this.board[y][x] === "S")
                {
                    this.board[y][x] = null;
                }
            }
        }
    }

    setShadows(y, x) {

        this.removeShadows()

        if (this.board[y][x] === "X")
        {
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

    placeStone(y,x)
    {

            this.board[y][x] = "X";
    }
}
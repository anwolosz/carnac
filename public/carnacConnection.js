var socket = io();

// let url = window.location.href;
// document.getElementById("copyInput").value = url;

const app = {
    data() {
        return {
            userId: null,
            url: window.location.href,
            carnac: new Carnac(window.location.href.match(/[^\/]+$/)[0], boardWidth, boardWidth)
        }
    },
    mounted() {

        fetch("http://localhost:3000/info/" + window.location.href.match(/[^\/]+$/)[0])
            .then(response => response.json())
            .then(data => {
                console.log(data);
                boardWidth = data.boardWidth;
                boardHeight = data.boardHeight;
            })
            .then(() => {
                
                
                this.carnac = new Carnac(window.location.href.match(/[^\/]+$/)[0], boardWidth, boardHeight)
                console.log("mounted");
                socket.emit("connectRoom", this.carnac.roomName);
                socket.on("start", (firstPlayerId, secondPlayerId) => {
                    console.log("Hello kezdünk");
                    // document.getElementById("game").style.display = "block"
                    // document.getElementById("waiting").style.display = "none"
                    this.carnac.gameStatus = "PLAYING"
                    this.carnac.firstPlayer.id = firstPlayerId
                    this.carnac.secondPlayer.id = secondPlayerId
                    this.carnac.activePlayer.id = firstPlayerId;
                    this.carnac.activePlayer.status = "PLACE_STONE"
                });
                socket.on("opponentMove", (y, x, stone) => {
                    let selection = this.carnac.selectedStone
                    this.carnac.move(y, x, stone, "OPPONENT");
                    this.carnac.selectedStone = selection
                });

                socket.on("opponentPass", (y, x, stone) => {
                    console.log("testpass");
                    this.carnac.pass("OPPONENT");
                });
            })


    },
    methods: {
        mouseOverCell(y, x) {
            //TODO: check game end
            if (this.carnac.activePlayer.id === socket.id && this.carnac.activePlayer.status === "PLACE_STONE") {
                this.carnac.placeStone(y, x);
            }

        },
        mouseClickCell(y, x) {
            // this.carnac.placeStone(y, x);
            console.log("ITTT?222?");
            if (this.carnac.move(y, x, this.carnac.selectedStone, socket.id)) {
                console.log("ITTT??");
                socket.emit("move", this.carnac.roomName, y, x, this.carnac.selectedStone)
            }

        },
        mouseClickPass() {
            if (this.carnac.pass(socket.id)) {
                socket.emit("pass", this.carnac.roomName)
                console.log("PAss");
            }
        },
        color(y, x) {
            if (this.carnac.board[y][x].color === 'W') {
                return "white";
            }
            if (this.carnac.board[y][x].color === 'R') {
                return "red";
            }
            if (this.carnac.board[y][x].color === 'B') {
                return "blue";
            }
            return ""
        },
        selectStone(stone) {
            this.carnac.selectedStone = stone;
        },
        playerColor() {
            if (this.carnac.firstPlayer.id === "OPPONENT") {
                return "WHITE"
            }
            if (this.carnac.firstPlayer.id === null) {
                return ""
            }
            return "RED"
        },
        copyToClipboard()
        {
            navigator.clipboard.writeText(this.url);
        },
        isActivePlayer()
        {
            return this.carnac.activePlayer.id === socket.id;
        }
    },
};

let boardWidth = 0
let boardHeight = 0

Vue.createApp(app).mount("#app")








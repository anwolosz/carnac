var socket = io();

const app = {
    data() {
        return {
            carnac: new Carnac(window.location.href.match(/[^\/]+$/)[0])
        }
    },
    mounted() {
        socket.emit("connectRoom", this.carnac.roomName);
        socket.on("start", (firstPlayerId, secondPlayerId) => {
            console.log("Hello kezdünk");
            this.carnac.firstPlayer.id = firstPlayerId
            this.carnac.secondPlayer.id = secondPlayerId
            this.carnac.activePlayer.id = firstPlayerId;
            this.carnac.activePlayer.status = "PLACE_STONE"
        });
        socket.on("opponentMove", (y, x) => {
            this.carnac.move(y, x, "OPPONENT");
        });

    },
    methods: {
        mouseOverCell(y, x) {
            //TODO: check game end
            if (this.carnac.activePlayer.id === socket.id && this.carnac.activePlayer.status === "PLACE_STONE")
            {
                this.carnac.placeStone(y, x, "ST1");
            }

        },
        mouseClickCell(y, x) {
            // this.carnac.placeStone(y, x);
            console.log("ITTT?222?");
            if (this.carnac.move(y, x, socket.id)) {
                console.log("ITTT??");
                socket.emit("move", this.carnac.roomName, y, x)
            }

        },
        mouseClickPass()
        {
            if (this.carnac.isPassAllowed())
            {
                console.log("PAss");
            }
        },
        color(y, x)
        {
            if (this.carnac.board[y][x].color === 'W')
            {
                return "white";
            }
            if (this.carnac.board[y][x].color === 'R')
            {
                return "red";
            }
            return ""
        },
        selectStone(stone)
        {
            this.carnac.selectedStone = stone;
        }

    },
};

Vue.createApp(app).mount("#app");





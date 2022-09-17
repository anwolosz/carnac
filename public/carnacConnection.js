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
            this.carnac.activePlayer = firstPlayerId;
        });
        socket.on("opponentMove", (y, x) => {
            this.carnac.move(y, x, "OPPONENT");
        });

    },
    methods: {
        mouseOverCell(y, x) {
            this.carnac.setShadows(y, x);
        },
        mouseClickCell(y, x) {
            // this.carnac.placeStone(y, x);
            console.log("ITTT?222?");
            if (this.carnac.move(y, x, socket.id)) {
                console.log("ITTT??");
                socket.emit("move", this.carnac.roomName, y, x)
            }

        }

    },
};

Vue.createApp(app).mount("#app");





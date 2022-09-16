var socket = io();

const app = {
    data() {
        return {
            carnac: new Carnac(window.location.href.match(/[^\/]+$/)[0])
        }
    },
    mounted() {
        socket.emit("connectRoom", this.carnac.roomName);

    },
    methods: {
        mouseOver(y, x)
        {
            console.log(y, x);
        },
        mouseOverCell(event, y, x) {
            drawMove(this.carnac.getShadows(y, x), event, y, x);
        },
        mouseClickCell(event, y, x) {
            event.target.classList.add("placedStone")
            event.target.classList.add("white")
            this.carnac.board[y][x] = "X"
            console.log(this.carnac.board);
        }

    },
  };
  
  Vue.createApp(app).mount("#app");





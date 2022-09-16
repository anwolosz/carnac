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
        mouseOverCell(y, x) {
            this.carnac.setShadows(y, x)
        },
        mouseClickCell(y, x) {
            this.carnac.placeStone(y, x);
            socket.emit("move", this.carnac.roomName, y, x)
        }

    },
  };
  
  Vue.createApp(app).mount("#app");





var socket = io();

const app = {
    data() {
        return {
            carnac: new Carnac(window.location.href.match(/[^\/]+$/)[0])
        }
    },
    mounted() {

    },
    methods: {
        mouseOver(y, x)
        {
            console.log(y, x);
        },
        mouseOverCell(event, y, x) {
            let shadowedCells = Array.from(document.getElementsByClassName("shadow"));
            for (let i = 0; i<shadowedCells.length; i++)
            {
                shadowedCells[i].classList.remove("shadow")
            }
            document.getElementsByClassName("unplacedStone")[0]?.classList.remove("unplacedStone")

            event.target.classList.add("unplacedStone")
            
            let shadows = this.carnac.getShadows(y, x);
            for (let i = 0; i<shadows.length; i++)
            {
                document.getElementById("board").rows[shadows[i][0]].cells[shadows[i][1]].classList.add("shadow");
            }
        },
        mouseClickCell(event, y, x) {
            event.target.classList.add("placedStone")
            this.carnac.board[y][x] = "X"
        }

    },
  };
  
  Vue.createApp(app).mount("#app");



socket.emit("connectRoom", roomName);

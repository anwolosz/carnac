var socket = io();

const app = {
    data() {
        return {
            carnac: new Carnac()
        }
    },
    mounted() {

    },
    methods: {

    },
  };
  
  Vue.createApp(app).mount("#app");

// TODO: maybe not elegant to take roomName from url
let url = window.location.href
let roomName = url.match(/[^\/]+$/)[0];
// console.log(roomName);


socket.emit("connectRoom", roomName);

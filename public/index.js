const app = {
    data() {
        return {
            createRoomName: (Math.random() + 1).toString(36).substring(7),
            joinRoomName: "",
        };
    },
    methods: {
        chooseRoomName() {
            this.createRoomName = "";
            document.getElementById("createRoomInput").hidden = false;
        },
        isEmptyString(name) {
            return name === "";
        },
        createRoom() {
            console.log("http://localhost:3000/createRoom/" + this.createRoomName);
            fetch("http://localhost:3000/createRoom/" + this.createRoomName) // TODO: change localhost to root host
                .then(response => response.json())
                .then(data => {
                    if (!data.exists) {
                        window.location.href = "http://localhost:3000/" + this.createRoomName;
                    }
                    else {
                        console.log("The room is already exists");
                    }
                })
        },
        joinRoom() {
            console.log("http://localhost:3000/isExists/" + this.joinRoomName);
            fetch("http://localhost:3000/isExists/" + this.joinRoomName)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        window.location.href = "http://localhost:3000/" + this.joinRoomName;
                    }
                    else {
                        console.log("The room is not exists");
                    }
                })


        }
    },
};

Vue.createApp(app).mount("#app");
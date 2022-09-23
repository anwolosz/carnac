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

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.previousElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
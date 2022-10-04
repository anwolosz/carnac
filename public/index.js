//let url = "http://warnac.herokuapp.com"
let url = "http://localhost:3000"

const app = {
    data() {
        return {
            createRoomName: (Math.random() + 1).toString(36).substring(7),
            joinRoomName: "",
            boardSize: "10x7",
            creatorColor: "RANDOM",
            isJoinRoomExists: true,
            isCreateRoomExists: false,
            inTimeLimit: true,
            isCorrectName: true,
            timeLimit: 10
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
        async createRoom() {
            console.log(url + "/createRoom/" + this.createRoomName);
            const rawResponse = await fetch(url + "/createRoom/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ room: this.createRoomName, boardSize: this.boardSize, creatorColor: this.creatorColor, timeLimit: this.timeLimit })
            });

            const roomInfo = await rawResponse.json();
            console.log(roomInfo);
            if (!roomInfo.exists && roomInfo.inTimeLimit && roomInfo.isCorrectName) {
                console.log("here");
                window.location.href = url + "/" + this.createRoomName;
            }
            else {
                this.isCreateRoomExists = roomInfo.exists;
                this.inTimeLimit = roomInfo.inTimeLimit;
                this.isCorrectName = roomInfo.isCorrectName;
                console.log("The room is already exists");
            }
        },
        joinRoom() {
            console.log(url + "/isExists/" + this.joinRoomName);
            fetch(url + "/isExists/" + this.joinRoomName)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        window.location.href = url + "/" + this.joinRoomName;
                    }
                    else {
                        this.isJoinRoomExists = false;
                        console.log("The room is not exists");
                    }
                })


        },
        selectBoardSize(size)
        {
            this.boardSize = size;
        },
        selectColor(color)
        {
            this.creatorColor = color;
        },
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
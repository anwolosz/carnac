const app = {
    data() {
        return {
            createRoomName: (Math.random() + 1).toString(36).substring(7),
            joinRoomName: "",
            boardSize: "10x7"
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
            console.log("http://localhost:3000/createRoom/" + this.createRoomName);
            const rawResponse = await fetch("http://localhost:3000/createRoom/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ room: this.createRoomName, boardSize: this.boardSize })
            });

            const content = await rawResponse.json();
            console.log(content);
            if (!content.exists) {
                console.log("here");
                window.location.href = "http://localhost:3000/" + this.createRoomName;
            }
            else {
                console.log("The room is already exists");
            }
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


        },
        selectBoardSize(size)
        {
            this.boardSize = size;
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
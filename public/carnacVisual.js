
function drawMove(shadows, event, y, x) {
    let shadowedCells = Array.from(document.getElementsByClassName("shadow"));
    for (let i = 0; i < shadowedCells.length; i++) {
        shadowedCells[i].classList.remove("shadow")
    }
    document.getElementsByClassName("unplacedStone")[0]?.classList.remove("unplacedStone")

    event.target.classList.add("unplacedStone")


    for (let i = 0; i < shadows.length; i++) {
        document.getElementById("board").rows[shadows[i][0]].cells[shadows[i][1]].classList.add("shadow");
    }
}
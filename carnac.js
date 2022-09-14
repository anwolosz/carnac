class Player {
    constructor()
    {
        this.id = null
    }
}

class Carnac {
    constructor()
    {
        this.firstPlayer = new Player()
        this.secondPlayer = new Player()
    }

    isEmpty()
    {
        return this.firstPlayer.id === null && this.secondPlayer.id === null;
    }

    hasFreePlayer()
    {
        return this.firstPlayer.id === null || this.secondPlayer.id === null;
    }
}


module.exports = Carnac;
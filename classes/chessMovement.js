class Movement {
    constructor() {
        this.startPosition = null;
        this.endPosition = null;
        this.player = null;
    }

    setStartPosition(position) {
        this.startPosition = position;
    }

    setEndPosition(position) {
        this.endPosition = position;
    }

    setPlayer(player) {
        this.player = player;
    }
}

export { Movement };
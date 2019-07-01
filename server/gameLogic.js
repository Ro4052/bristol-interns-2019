let roundNum = 0;
let players = [];

exports.initGame = () => {
    players = players.map(player => {
        return {...player, "finishedTurn": false}
    });
}

exports.getRoundInfo = () => {
    return {
        roundNum: roundNum,
        currentPlayer: this.getCurrentPlayer()
    };
}

exports.incrementRound = () => {
    roundNum++;
    players = players.map(player => {
        return {...player, "finishedTurn": false}
    });
}

exports.getPlayerIndexByUsername = username => {
    return players.findIndex(player => player.username === username);
}

exports.getPlayers = () => {
    return players;
}

exports.getCurrentPlayer = () => {
    return players[roundNum % players.length];
}

exports.joinGame = player => {
    players.push(player);
}

exports.endPlayerTurn = player => {
    players[this.getPlayerIndexByUsername(player.username)].finishedTurn = true;
}

exports.allPlayersFinishedTurn = () => {
    for (let player of players) {
        if (!player.finishedTurn) return false;
    }
    return true;
}
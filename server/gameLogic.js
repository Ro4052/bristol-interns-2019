let roundNum = 0;
let players = [];

exports.initGame = () => {
    console.log("initGame");
}

exports.getPlayers = () => {
    console.log(players);
    return players;
}

exports.getCurrentPlayer = () => {
    return players[roundNum % players.length];
}

exports.joinGame = player => {
    console.log("joinGame", player);
    players.push(player);
    console.log("players", players);
    // TODO callback for response
}
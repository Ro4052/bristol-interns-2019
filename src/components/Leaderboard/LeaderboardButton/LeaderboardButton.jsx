import React from 'react';
import history from '../../../services/history';

export class LeaderboardButton extends React.Component {
    constructor() {
        super();
        this.goToLeaderBoard = this.goToLeaderBoard.bind(this);
    }

    goToLeaderBoard() {
        history.push('/leaderboard');
    }

    render() {
        return (
            <div>
                <button onClick={this.goToLeaderBoard} data-cy="go-leaderboard" type='button'>Leaderboard</button>
            </div>
        );
    }
}

export default LeaderboardButton;

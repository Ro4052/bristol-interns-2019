import React from 'react';
import Button from '../../shared/Button/Button';
import history from '../../../services/history';

export class LeaderboardButton extends React.Component {
    constructor() {
        super();
        this.goToLeaderBoard = this.goToLeaderBoard.bind(this);
    }

    goToLeaderBoard(e) {
        e.preventDefault();
        history.push('/leaderboard');
    }

    render() {
        return (
            <form data-cy='go-leaderboard-form' onSubmit={this.goToLeaderBoard}>
                <Button cy="go-leaderboard" text="Leaderboard" />
            </form>
        );
    }
}

export default LeaderboardButton;

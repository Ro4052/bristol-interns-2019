import React from 'react';
import Button from '../../shared/Button/Button';
import history from '../../../services/history';

export class LeaderboardButton extends React.Component {
    goToLeaderBoard() {
        history.push('/leaderboard');
    }

    render() {
        return (
            <div>
                <Button cy="go-leaderboard" handleClick={this.goToLeaderBoard} text="Leaderboard" />
            </div>
        );
    }
}

export default LeaderboardButton;

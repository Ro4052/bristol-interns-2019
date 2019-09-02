import React from 'react';

export class LeaderboardButton extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => this.props.history.push('/leaderboard')} data-cy="go-leaderboard" type='button'>Leaderboard</button>
            </div>
        );
    }
}

export default LeaderboardButton;

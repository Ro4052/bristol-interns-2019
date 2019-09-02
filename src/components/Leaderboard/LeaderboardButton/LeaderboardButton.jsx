import React from 'react';

export function LeaderboardButton(props) {
    return (
        <div>
            <button onClick={() => props.history.push('/leaderboard')} data-cy="go-leaderboard" type='button'>Leaderboard</button>
        </div>
    );
}

export default LeaderboardButton;

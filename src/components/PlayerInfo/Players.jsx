import React from 'react';
import style from '../Dashboard/Dashboard.module.css'

export class Players extends React.PureComponent {
    render() {
        return (
            <div className={style.currentPlayersBox}>
                <h3>Players:</h3>
                <ul id="players">
                    {this.props.players.map((player, key) => {
                        return <li key={key}>{player.username}</li>
                    })}
                </ul>
            </div>
        )
    }
}

export default Players;
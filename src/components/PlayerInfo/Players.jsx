import React from 'react';
import style from '../Dashboard/Dashboard.module.css';
import { connect } from 'react-redux';

export class Players extends React.PureComponent {
    render() {
        return (
            <div className={style.currentPlayersBox}>
                <h3>Players:</h3>
                <ul id="players">
                    {this.props.allPlayers.map((player, key) => {
                        return <li key={key}>{player.username}</li>
                    })}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        allPlayers: state.reducer.allPlayers
    });
}

export default connect(mapStateToProps)(Players);

import React from 'react';
import style from '../../Dashboard/Dashboard.module.css';
import { connect } from 'react-redux';

export class Players extends React.PureComponent {
    
    render() {
        return (
            <div className={style.currentPlayersBox}>
                <h3>Players:</h3>
                <ul id="players">
                    {this.props.players.map((player, key) => <li key={key}>{player.username}</li>)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    players: state.reducer.players
});

export default connect(mapStateToProps)(Players);

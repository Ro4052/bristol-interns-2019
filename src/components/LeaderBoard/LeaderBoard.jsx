import React from 'react';
import { connect } from 'react-redux';
import styles from './LeaderBoard.module.css';
import history from '../../services/history';

export class LeaderBoard extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.leaderBoardPage}>
                <ul className={styles.leaderBoard}>
                    <li>Someone</li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);

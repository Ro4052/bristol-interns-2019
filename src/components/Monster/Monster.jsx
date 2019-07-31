import React from 'react';
import { connect } from 'react-redux';
import styles from './Monster.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


export function Monster(props) {
    const loser = props.winner && props.winner.username !== props.username;
    const winner = props.winner && !loser;
    let bodyClass = styles.body;
    if (props.error) bodyClass = styles.disappointedBody;
    if (winner) bodyClass = styles.victoryBody;
    return (
        <div className={styles.ufo}>
            <div className={styles.monster}>
                <div className={bodyClass}> 
                    <div className={styles.ear}></div>
                    <div className={styles.ear}></div>
                    <div className={styles.vampimouth}>
                        <div className={styles.vampitooth}></div>
                    </div>
                
                    <div className={props.error ? styles.angryeyelid : styles.eyelid}>
                        <div className={styles.eyes}>
                            <div className={styles.eye}>
                                <div className={cx({ meaneye: props.error})}></div>
                                {props.winner && <div className={cx({tear: loser})}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
}

const mapStateToProps = (state) => ({
    winner: state.gameOverReducer.winner,
    username: state.authReducer.username,
    error: state.playWordReducer.error
});

export default connect(mapStateToProps)(Monster);

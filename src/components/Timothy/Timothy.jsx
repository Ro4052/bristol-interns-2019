import React from 'react';
import { connect } from 'react-redux';
import styles from './Timothy.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export function Timothy(props) {
    const winner = (props.winners.length > 0 && props.winners.some(winner => winner.username === props.username));
    let bodyClass = styles.body;
    if (props.error) bodyClass = styles.disappointedBody;
    if (winner) bodyClass = styles.victoryBody;
    return (
        <div data-cy='timothy' className={styles.ufo}>
            <div className={styles.timothy}>
                <div data-cy='timothy-body' className={bodyClass}> 
                    <div className={styles.ear}></div>
                    <div className={styles.ear}></div>
                    <div className={styles.vampimouth}>
                        <div className={styles.vampitooth}></div>
                    </div>
                    <div data-cy='timothy-eyelid' className={props.error && !winner ? styles.angryeyelid : styles.eyelid}>
                        <div className={styles.eyes}>
                            <div className={styles.eye}>
                                <div data-cy='timothy-meaneye' className={cx({ meaneye: props.error && !winner })}></div>
                                {props.winners.length > 0 && <div data-cy='timothy-tear' className={cx({tear: !winner})}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
}

const mapStateToProps = (state) => ({
    winners: state.gameOverReducer.winners,
    username: state.authReducer.username,
    error: state.playWordReducer.error,
    drawers: state.gameOverReducer.drawers
});

export default connect(mapStateToProps)(Timothy);

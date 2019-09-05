import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Timothy.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Timothy() {
    const { username } = useSelector(state => state.authReducer);
    const { winners } = useSelector(state => state.gameOverReducer);
    const { error } = useSelector(state => state.playWordReducer);

    const winner = (winners.length > 0 && winners.some(winner => winner.username === username));
    let bodyClass = styles.body;
    if (error) bodyClass = styles.disappointedBody;
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
                    <div data-cy='timothy-eyelid' className={error && !winner ? styles.angryeyelid : styles.eyelid}>
                        <div className={styles.eyes}>
                            <div className={styles.eye}>
                                <div data-cy='timothy-meaneye' className={cx({ meaneye: error && !winner })}></div>
                                {winners.length > 0 && <div data-cy='timothy-tear' className={cx({tear: !winner})}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
}

export default Timothy;

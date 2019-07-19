import React from 'react';
import { connect } from 'react-redux';
import styles from './Monster.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


export function Monster(props) {

        let bodyClass = styles.body;
        if (props.invalidWord) bodyClass = styles.disappointedbody;
        if (props.winner) bodyClass = styles.victorybody;
    return (
        <div className={styles.ufo}>
            <div className={styles.monster}>
                <div className={bodyClass}> 
                    <div className={styles.ear}></div>
                    <div className={styles.ear}></div>
                    <div className={styles.vampimouth}>
                        <div className={styles.vampitooth}></div>
                    </div>
                
                    <div className={props.invalidWord ? styles.angryeyelid : styles.eyelid}>
                        <div className={styles.eyes}>
                            <div className={styles.eye}>
                                <div className={cx({ meaneye: props.invalidWord})}></div>
                                {/* <div className={cx({tear: props.error})}></div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
}

const mapStateToProps = (state) => ({
    invalidWord: state.gameReducer.invalidWord,
    winner: state.gameReducer.winner,
    error: state.playerReducer.error
});

export default connect(mapStateToProps)(Monster);

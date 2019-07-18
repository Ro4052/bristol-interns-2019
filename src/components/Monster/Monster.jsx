import React from 'react';
import { connect } from 'react-redux';
import styles from './Monster.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


export class Monster extends React.Component {
    render() {
        let bodyClass = styles.body;
        if (this.props.invalidWord) bodyClass = styles.disappointedbody;
        if (this.props.winner) bodyClass = styles.victorybody;
        return (
            <div className={styles.ufo}>
                <div className={styles.monster}>
                    <div className={bodyClass}> 
                        <div className={styles.ear}></div>
                        <div className={styles.ear}></div>
                        <div className={styles.vampimouth}>
                            <div className={styles.vampitooth}></div>
                        </div>
                    
                        <div className={this.props.invalidWord ? styles.angryeyelid : styles.eyelid}>
                            <div className={styles.eyes}>
                                <div className={styles.eye}>
                                    <div className={cx({ meaneye: this.props.invalidWord})}></div>
                                    {/* <div className={cx({tear: this.props.error})}></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    invalidWord: state.gameReducer.invalidWord,
    winner: state.gameReducer.winner,
    error: state.playerReducer.error
});

export default connect(mapStateToProps)(Monster);

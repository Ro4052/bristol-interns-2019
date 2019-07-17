import React from 'react';
import styles from './Dixit.module.css';

export class Dixit extends React.Component {
    render() {
        return (
            <div className={styles.foo}>
                <span className={styles.letter} data-letter="D">D</span>
                <span className={styles.letter} data-letter="i">i</span>
                <span className={styles.letter} data-letter="X">X</span>
                <span className={styles.letter} data-letter="i">i</span>
                <span className={styles.letter} data-letter="t">t</span>
            </div>
        );
    }
}

export default Dixit;

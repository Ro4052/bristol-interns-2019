import React from 'react';
import styles from './Dixit.module.css';

export class Dixit extends React.Component {
    render() {
        const letters = ["T", "e", "l", "l", "T", "a", "l", "e", "s"];
        return (
            <div className={styles.dixit}>
                {letters.map((letter, key) => <span key={key} className={styles.letter} data-letter={letter}>{letter}</span>)}
            </div>
        );
    }
}

export default Dixit;

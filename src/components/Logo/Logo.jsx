import React from 'react';
import styles from './Logo.module.css';

export class Logo extends React.Component {
    render() {
        const letters = ["T", "e", "l", "l", "T", "a", "l", "e", "s"];
        return (
            <div className={styles.logo}>
                {letters.map((letter, key) => <span key={key} className={styles.letter} data-letter={letter}>{letter}</span>)}
            </div>
        );
    }
}

export default Logo;

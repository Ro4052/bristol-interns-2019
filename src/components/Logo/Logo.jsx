import React from 'react';
import styles from './Logo.module.css';

function Logo() {
    const letters = ["T", "e", "l", "l", "T", "a", "l", "e", "s"];
    return (
        <div className={styles.logo}>
            {letters.map((letter, index) => <span key={index} className={styles.letter} data-letter={letter}>{letter}</span>)}
        </div>
    );
}

export default Logo;

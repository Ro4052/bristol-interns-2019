import React from 'react';
import styles from '../PlayWordAndCard/PlayWordAndCard.module.css';

export const VoteCard = () => {
    return (
        <div className={styles.playerInteractions}>
            <h3 data-cy="vote-card">Vote for a card</h3>
        </div>
    );
}

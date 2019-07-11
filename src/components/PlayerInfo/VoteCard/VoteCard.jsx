import React from 'react';
import styles from '../PlayWordAndCard/PlayWordAndCard.module.css';

export class VoteCard extends React.PureComponent {

    render() {
        return (
            <div className={styles.playerInteractions}>
                <h3>Vote for a card</h3>
            </div>
        );
    }
}

export default (VoteCard);

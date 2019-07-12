import React from 'react';
import styles from '../PlayWordAndCard/PlayWordAndCard.module.css';

export class PlayCard extends React.PureComponent {

    render() {
        return (
            <div className={styles.playerInteractions}>
                <h3 data-cy="play-card">Pick a card</h3>
            </div>
        );
    }
}

export default (PlayCard);

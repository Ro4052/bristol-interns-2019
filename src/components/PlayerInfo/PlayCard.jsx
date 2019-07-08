import React from 'react';
import styles from './PlayWordAndCard.module.css';

export class PlayCard extends React.PureComponent {

    render() {
        return (
            <div className={styles.playerInteractions}>
                <h3>Pick a card</h3>
            </div>
        );
    }
}

export default (PlayCard);

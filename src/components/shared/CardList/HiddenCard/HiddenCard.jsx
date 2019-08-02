import React from 'react';
import styles from '../Card/Card.module.css';

export class HiddenCard extends React.PureComponent {
    render() {
        return (
            <div data-cy='card-wrapper' className={styles.cardWrapper}>
                <img data-cy='card' className={styles.card} alt="card-hidden" src={require('../../../../images/cardBack.jpg')} />
            </div>
        );
    }
}

export default HiddenCard;

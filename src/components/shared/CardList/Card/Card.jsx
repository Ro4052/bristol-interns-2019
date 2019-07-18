import React from 'react';
import styles from './Card.module.css';
import classNames from 'classnames';

export class Card extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.enabled) this.props.handleClick(this.props.card.cardId);
    }

    render() {
        return (
            <div data-cy='card-wrapper' className={classNames(styles.cardWrapper, this.props.enabled ? styles.enabled : styles.disabled)} onClick={this.handleClick}>
                <img data-cy='card' className={styles.card} alt={`card-${this.props.card.cardId}`} src={require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`)} />
                {(this.props.card.votes !== undefined) && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
            </div>
        );
    }
}

export default Card;

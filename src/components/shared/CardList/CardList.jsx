import React from 'react';
import styles from './CardList.module.css';
import { Card } from './Card/Card';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class CardList extends React.Component {
    render() {
        return (
            <div className={cx(styles.cardList, {myCards: this.props.cy === 'my-cards'}, {playedCards: this.props.cy === 'played-cards'})} data-cy={this.props.cy}>
                {this.props.cards.map(card => <Card card={card} key={card.cardId} handleClick={this.props.handleClick} playedCard={this.props.playedCard} enabled={this.props.isEnabled(card.cardId)} />)}
            </div>
        );
    }
}

export default CardList;

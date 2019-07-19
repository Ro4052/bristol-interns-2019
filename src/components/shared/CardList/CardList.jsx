import React from 'react';
import styles from './CardList.module.css';
import Card from './Card/Card';

export class CardList extends React.Component {
    render() {
        return (
            <div className={styles.cardList} data-cy={this.props.cy}>
                {this.props.cards.map(card => <Card card={card} key={card.cardId} handleClick={this.props.handleClick} enabled={this.props.isEnabled(card.cardId)} />)}
            </div>
        );
    }
}

export default CardList;

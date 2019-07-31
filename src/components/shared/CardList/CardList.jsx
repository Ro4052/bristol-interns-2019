import React from 'react';
import styles from './CardList.module.css';
import Card from './Card/Card';
import HiddenCard from './HiddenCard/HiddenCard';

export class CardList extends React.Component {
    render() {
        return (
            <div className={styles.cardList} data-cy={this.props.cy}>
                {
                    (this.props.hidden) 
                    ? this.props.cards.map((card, index) => <HiddenCard key={index} />)
                    : this.props.cards.map(card => <Card card={card} hidden={this.props.hidden} myCards={this.props.myCards} key={card.cardId} handleClick={this.props.handleClick} enabled={this.props.isEnabled(card.cardId)} />)
                }
            </div>
        );
    }
}

export default CardList;

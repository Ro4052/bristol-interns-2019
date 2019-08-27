import React from 'react';
import styles from './CardList.module.css';
import Card from './Card/Card';

export class CardList extends React.Component {
    render() {
        console.log(this.props.cards);
        
        return (
            <div className={styles.fade}>
                <div className={styles.cardList} data-cy={this.props.cy}>
                    <div className={styles.spacer}></div>
                    {this.props.cards.map((card, key) => <Card card={card} myCards={this.props.myCards} key={card.cardId || key} handleClick={this.props.handleClick} enabled={this.props.isEnabled(card.cardId)} />)}
                    <div className={styles.spacer}></div>
                </div>
            </div>
        );
    }
}

export default CardList;

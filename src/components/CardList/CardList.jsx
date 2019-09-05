import React from 'react';
import styles from './CardList.module.css';
import Card from './Card/Card';

function CardList({ cy, cards, handleClick, isEnabled }) {
    return (
        <div className={styles.fade}>
            <div className={styles.cardList} data-cy={cy}>
                <div className={styles.spacer} />
                {cards.map((card, index) => <Card card={card} key={card.cardId || index} handleClick={handleClick} enabled={isEnabled(card.cardId)} />)}
                <div className={styles.spacer} />
            </div>
        </div>
    );
}

export default CardList;

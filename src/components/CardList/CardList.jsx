import React from 'react';
import styles from './CardList.module.css';
import Card from './Card/Card';

function CardList(props) {
    const { cy, cards, handleClick, isEnabled } = props;
    return (
        <div className={styles.fade}>
            <div className={styles.cardList} data-cy={cy}>
                <div className={styles.spacer} />
                {cards.map((card, key) => <Card card={card} key={card.cardId || key} handleClick={handleClick} enabled={isEnabled(card.cardId)} />)}
                <div className={styles.spacer} />
            </div>
        </div>
    );
}

export default CardList;

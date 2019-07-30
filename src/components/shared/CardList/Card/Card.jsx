import React from 'react';
import { connect } from 'react-redux';
import styles from './Card.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Card extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.enabled) this.props.handleClick(this.props.card.cardId);
    }

    getImageForCard() {
        if (this.props.hidden) {
            return require(`../../../../images/cardBack.jpg`);
        }
        return require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`);
    }

    render() {
        return (
            <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, { disabled: !this.props.enabled }, {selected : this.props.playedCardId === this.props.card.cardId})} onClick={this.handleClick}>
                <img data-cy='card' className={styles.card} alt={`card-${(this.props.hidden) ? "hidden" : this.props.card.cardId}`} src={this.getImageForCard()} />
                {(this.props.card.votes !== undefined) && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playedCardId: state.myCardsReducer.playedCardId
});

export default connect(mapStateToProps)(Card);

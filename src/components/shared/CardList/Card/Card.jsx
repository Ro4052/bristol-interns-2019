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

    render() {
        return (
            <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, { disabled: !this.props.enabled }, {selected : this.props.playedCard === this.props.card.cardId})} onClick={this.handleClick}>
                <img data-cy='card' className={styles.card} alt={`card-${this.props.card.cardId}`} src={require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`)} />
                {(this.props.card.votes !== undefined) && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playedCard: state.playerReducer.playedCard
});

export default connect(mapStateToProps)(Card);

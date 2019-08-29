import React from 'react';
import { connect } from 'react-redux';
import styles from './Card.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Card extends React.Component {
    constructor() {
        super();
        this.state = { loading: true };
        this.handleClick = this.handleClick.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
    }

    handleImageLoaded() {
        this.setState({ loading: false });
    }

    handleClick() {
        if (this.props.enabled) this.props.handleClick(this.props.card.cardId);
    }

    getPlayersVoted(card) {
        return (card.votes.length > 0) ? card.votes.map((vote, index) => <li key={index}>{vote.username}</li>) : <li>none :(</li>;
    }

    render() {
        const src = {
            original: this.props.card.cardId ? require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`) : require('../../../../images/cardBack.jpg'),
            custom: this.props.card.url
        }[this.props.gameMode];
        const alt = this.props.card.cardId ? `card-${this.props.card.cardId}` : 'card-hidden';
        return (
            <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, { selected: this.props.enabled && this.props.playedCardId === this.props.card.cardId })}>
                <div data-cy='card' onClick={this.handleClick} className={cx(styles.card, { flip: this.props.card.cardId && !this.state.loading }, { storyteller: this.props.currentPlayer && this.props.currentPlayer.username === this.props.card.username })}>
                    <div data-cy='card-front' className={styles.front}>
                        <img data-cy='card-image' className={cx(styles.image, { fade: !this.props.enabled })} alt={alt} src={src} onLoad={this.handleImageLoaded} />
                        {this.props.card.votes !== undefined && 
                        <div className={styles.cardInfo}>
                            <div className={styles.playerName} data-cy='player-name'><span className={styles.playerText}>{this.props.card.username}</span>+{this.props.newScores.find(score => score.username === this.props.card.username).score}</div>
                            <div className={styles.votes}>
                                <span>Votes</span>
                                <span className={(this.props.card.votes.length) > 0 ? styles.voteText : ""} data-cy='voter'>{this.getPlayersVoted(this.props.card)}</span>
                            </div>
                        </div>}
                    </div>
                    <div className={styles.back}>
                        <img data-cy='card-image' className={styles.image} alt="card-hidden" src={require('../../../../images/cardBack.jpg')} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    playedCardId: state.myCardsReducer.playedCardId,
    newScores: state.playersReducer.newScores,
    currentPlayer: state.playersReducer.currentPlayer,
    gameMode: state.createRoomReducer.gameMode
});

export default connect(mapStateToProps)(Card);

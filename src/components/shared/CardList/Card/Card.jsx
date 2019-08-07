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

    render() {
        const src = this.props.card.cardId ? require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`) : require('../../../../images/cardBack.jpg');
        const alt = this.props.card.cardId ? `card-${this.props.card.cardId}` : 'card-hidden';
        return (
            <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, {selected : this.props.playedCardId === this.props.card.cardId})}>
                <div onClick={this.handleClick} className={cx(styles.card, { flip: this.props.card.cardId && !this.state.loading })}>
                    <div data-cy='card-front' className={styles.front}>
                        <img data-cy='card-image' className={cx(styles.image, { fade: !this.props.enabled })} alt={alt} src={src} onLoad={this.handleImageLoaded} />
                        {this.props.card.votes !== undefined && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
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
    status: state.dashboardReducer.status
});

export default connect(mapStateToProps)(Card);

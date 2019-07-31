import React from 'react';
import { connect } from 'react-redux';
import styles from './Card.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Card extends React.Component {

    constructor() {
        super();
        this.state = {
            flipped: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (!this.props.myCards) {
            setTimeout(() => {            
                this.setState({
                    flipped: true
                })
            }, 300);
        }
    }
    
    handleClick() {
        if (this.props.enabled) this.props.handleClick(this.props.card.cardId);
    }

    render() {        
        if (this.props.myCards) {
            return (
                <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, { disabled: !this.props.enabled }, {selected : this.props.playedCardId === this.props.card.cardId})} onClick={this.handleClick}>
                    <img data-cy='card' className={styles.card} alt={`card-${this.props.card.cardId}`} src={require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`)} />
                    {(this.props.card.votes !== undefined) && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
                </div>
            );
        } else {
            return (
                <div data-cy='card-wrapper' className={cx(styles.cardWrapper, { enabled: this.props.enabled }, { disabled: !this.props.enabled }, {selected : this.props.playedCardId === this.props.card.cardId})} onClick={this.handleClick}>
                    <div className={cx(styles.cardWrapperInner, {flipped: this.state.flipped})} onAnimationEnd={() => this.setState({flipped: false})}>
                        <div className={styles.front}>
                            <img data-cy='card' className={styles.card} alt="card-hidden" src={require('../../../../images/cardBack.jpg')} />
                        </div>
                        <div className={styles.back}>
                            <img data-cy='card' className={styles.card} alt={`card-${this.props.card.cardId}`} src={require(`../../../../images/cards/card (${this.props.card.cardId}).jpg`)} />
                            {(this.props.card.votes !== undefined) && <div className={styles.vote} data-cy='vote'>Votes: {this.props.card.votes}</div>}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    playedCardId: state.myCardsReducer.playedCardId,
    status: state.dashboardReducer.status
});

export default connect(mapStateToProps)(Card);

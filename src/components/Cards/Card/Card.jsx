import React from 'react';
import { connect } from 'react-redux';
import styles from './Card.module.css';
import classNames from 'classnames';

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
        const classes = classNames(styles.card, this.props.enabled ? styles.enabled : styles.disabled);
        return (
            <img className={classes} alt={`card-${this.props.card.cardId}`} src={require(`../../../images/cards/card (${this.props.card.cardId}).jpg`)} onClick={this.handleClick} />
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);

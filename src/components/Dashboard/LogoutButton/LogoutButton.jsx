import React from 'react';
import { connect } from 'react-redux';
import styles from '../../Login/Login.module.css';
import { logOutUser } from '../../../store/playerActions';

export class LogoutButton extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        this.props.logOutUser();
    }

    render() {        
        return (
            <button id='logout-button' data-cy="logout" className={styles.logOutButton} onClick={this.logOut}>Log out</button>
        );
    }
}

const mapStateToProps = (state) => ({
    cookie: state.playerReducer.cookie,
    loading: state.playerReducer.loading,
    error: state.playerReducer.error
});

const mapDispatchToProps = (dispatch) => ({
    logOutUser: () => dispatch(logOutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);

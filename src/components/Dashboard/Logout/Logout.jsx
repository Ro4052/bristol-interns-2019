import React from 'react';
import Button from '../../shared/Button/Button';
import { connect } from 'react-redux';
import { logOutUser } from '../../../store/playerActions';
import styles from './Logout.module.css';

export class Logout extends React.Component {
    render() {
        return (
            <div className={styles.logoutButton}>
                <Button cy="logout" handleClick={this.props.logOutUser} text="Log out" />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOutUser: () => dispatch(logOutUser())
});

export default connect(null, mapDispatchToProps)(Logout);

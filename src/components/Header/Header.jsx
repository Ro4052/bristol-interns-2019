import React from 'react';
import styles from './Header.module.css';
import Logo from '../Logo/Logo';
import Logout from '../Logout/Logout';

function Header(props) {
    const { history } = props;
    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <button onClick={() => history.push('/leaderboard')} data-cy="go-leaderboard" type='button'>Leaderboard</button>
                <button onClick={() => history.push('/upload')} data-cy="go-upload" type='button'>Upload</button>
            </div>
            <Logo />
            <Logout />
        </div>
    );
}

export default Header;

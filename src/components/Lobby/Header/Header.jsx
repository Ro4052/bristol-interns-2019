import React from 'react';
import styles from './Header.module.css';
import Logo from '../../Logo/Logo';
import Logout from '../../Logout/Logout';
import LeaderboardButton from '../../Leaderboard/LeaderboardButton/LeaderboardButton';
import UploadButton from '../../Upload/UploadButton/UploadButton';

export function Header(props) {
    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <LeaderboardButton history={props.history} />
                <UploadButton history={props.history} />
            </div>
            <Logo />
            <Logout />
        </div>
    );
}

export default Header;

import React from 'react';
import styles from './Header.module.css';
import Logo from '../../Logo/Logo';
import Logout from '../../Logout/Logout';
import LeaderboardButton from '../../Leaderboard/LeaderboardButton/LeaderboardButton';
import UploadButton from '../../Upload/UploadButton/UploadButton';

export function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <LeaderboardButton />
                <UploadButton />
            </div>
            <Logo />
            <Logout />
        </div>
    );
}

export default Header;

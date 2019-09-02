import React from 'react';
import styles from './Header.module.css';
import Logo from '../../Logo/Logo';
import Logout from '../../Logout/Logout';
import LeaderboardButton from '../../Leaderboard/LeaderboardButton/LeaderboardButton';
import UploadButton from '../../Upload/UploadButton/UploadButton';

export class Header extends React.Component {
    render() {
        return (
            <div className={styles.header}>
                <LeaderboardButton />
                <UploadButton />
                <Logo />
                <Logout />
            </div>
        );
    }
}

export default Header;

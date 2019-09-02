import React from 'react';
import styles from './Header.module.css';
import Logo from '../../Logo/Logo';
import Logout from '../../Logout/Logout';
import LeaderboardButton from '../../Leaderboard/LeaderboardButton/LeaderboardButton';

export class Header extends React.Component {
    render() {
        return (
            <div className={styles.header}>
                <LeaderboardButton />
                <Logo />
                <Logout />
            </div>
        );
    }
}

export default Header;

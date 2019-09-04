import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './Header.module.css';
import Logo from '../../Logo/Logo';
import { logOut } from '../../Login/LoginActions';

function Header(props) {
    const { history } = props;
    const dispatch = useDispatch();
    return (
        <div className={styles.header}>
            <div className={styles.buttons}>
                <button onClick={() => history.push('/leaderboard')} data-cy="go-leaderboard" type='button'>Leaderboard</button>
                <button onClick={() => history.push('/upload')} data-cy="go-upload" type='button'>Upload</button>
            </div>
            <Logo />
            <button onClick={() => dispatch(logOut())} data-cy="logout" type='button'>Logout</button>
        </div>
    );
}



export default Header;

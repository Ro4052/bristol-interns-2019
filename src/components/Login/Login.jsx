import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import Timothy from '../Timothy/Timothy';
import Logo from '../Logo/Logo';
import { authenticateUser, logIn, signUp } from './LoginActions';
import classNames from 'classnames/bind';
import github from '../../images/github.png';

const cx = classNames.bind(styles);
function Login() {
    const [currentUsername, setCurrentUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [signUpToggle, setSignUpToggle] = React.useState(false);
    const { username, uri, error } = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authenticateUser());
    }, [dispatch]);

    const sendLoginOrSignUp = e => {
        e.preventDefault();           
        if (signUpToggle) {
            dispatch(signUp(currentUsername, password));
        } else {
            dispatch(logIn(currentUsername, password));
        }
    }

    return (
        username ?
            <Redirect to='/lobby' /> :
            <div className={styles.loginPage}>
                <Logo />
                <form className={styles.loginForm} onSubmit={sendLoginOrSignUp} data-cy='login-form' >
                    <h2 className={styles.formHeader}>{signUpToggle ? "Enter a username and password to sign up for the game" : "Log in with your username and password to enter the game"}</h2>
                    <input type='text' data-cy='username' className={cx(styles.loginInput, { inputError: error })} username={currentUsername} placeholder="Enter username" onChange={e => setCurrentUsername(e.target.value)} autoFocus />
                    <input type='password' data-cy='password' className={cx(styles.loginInput, { inputError: error })} password={password} placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                    {error && <h3 data-cy="login-error" className={styles.errorText}>{error}</h3>}
                    <button className={styles.logInButton} data-cy="login" type='submit'>{signUpToggle ? "Sign up" : "Log in"}</button>
                </form>
                <button className={styles.toggleButton} data-cy="toggle-signup" onClick={() => setSignUpToggle(!signUpToggle)}>{signUpToggle ? "Already a member? Log in." : "Don't have an account? Sign up"}</button> or
                <a className={styles.githubLogin} href={uri}>Log in with GitHub <img src={github} className={styles.githubLogo} alt='github-logo' /></a>
                <Timothy />
            </div>
    );
}

export default Login;

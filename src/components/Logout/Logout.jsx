import React from 'react';
import Button from '../shared/Button/Button';
import { connect } from 'react-redux';
import { logOut } from '../Login/LoginActions';

export class Logout extends React.Component {
    render() {
        return (
            <div>
                <Button cy="logout" handleClick={this.props.logOut} text="Log out" />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut())
});

export default connect(null, mapDispatchToProps)(Logout);

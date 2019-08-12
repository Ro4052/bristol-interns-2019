import React from 'react';
import Button from '../shared/Button/Button';
import { connect } from 'react-redux';
import { logOut } from '../Login/LoginActions';

export class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(e) {
        e.preventDefault();
        this.props.logOut();
    }

    render() {
        return (
            <form data-cy="logout-form" onSubmit={this.logout}>
                <Button cy="logout" text="Log out" />
            </form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut())
});

export default connect(null, mapDispatchToProps)(Logout);

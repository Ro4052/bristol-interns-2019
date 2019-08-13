import React from 'react';
import { connect } from 'react-redux';
import { logOut } from '../Login/LoginActions';

export class Logout extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.logOut} data-cy="logout" type='button'>Logout</button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut())
});

export default connect(null, mapDispatchToProps)(Logout);

import React from 'react';
import Button from '../shared/Button/Button';
import { connect } from 'react-redux';
import { logOutUser } from '../shared/Auth/AuthActions';

export class Logout extends React.Component {
    render() {
        return (
            <div>
                <Button cy="logout" handleClick={this.props.logOutUser} text="Log out" />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOutUser: () => dispatch(logOutUser())
});

export default connect(null, mapDispatchToProps)(Logout);

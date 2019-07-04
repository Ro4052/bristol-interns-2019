import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default function Auth(ProtectedComponent) {

  return class extends Component {

    constructor() {
      super();
      this.state = {
        loading: true,
        authenticated: false
      };
    }
    componentDidMount() {
      axios.get('/auth', {
        validateStatus: (status) => {
          return status < 500;
        }})
        .then(res => {            
            if (res.status === 200) {
                this.setState({ loading: false, authenticated: true });
            } else if (res.status === 400) {
                this.setState({ loading: false, authenticated: false });
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
        .catch(err => {
          this.setState({ loading: false, authenticated: false });
        });
    }
    render() {
      const { loading, authenticated } = this.state;
      if (loading) return null;
      if (authenticated) return (<ProtectedComponent {...this.props} />);
      return (<Redirect to='/' />);
    }
  }
}
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes } from 'redux-form';
import request from '../../api';
import { getToken } from './duck';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { checking: false, authorized: false };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');

    if (token) {
      this.setState({ checking: true });
      const options = { headers: { authorization: token } };

      request('/api/admin/testaccess', options)
        .then(() => {
          this.setState({ checking: false, authorized: true });
          window.location = '/admin';
        })
        .catch((err) => {
          this.setState({ checking: false });

          if (err.status === 401) {
            localStorage.removeItem('token');
          }
        });
    }
  }

  render() {
    const { error, handleSubmit, actions } = this.props;

    if (this.state.checking) {
      return <div>Checking status...</div>;
    }

    if (this.state.authorized) {
      return <div>Redirecting...</div>;
    }

    return (
      <div className="simple-container">
        <div className="login">
          <form className="pure-form" onSubmit={handleSubmit(actions.getToken)}>
            <fieldset>
              <Field name="username" component="input" type="text" placeholder="Username" />
              <Field name="password" component="input" type="password" placeholder="Password" />
              <button type="submit" className="pure-button pure-button-primary">Sign in</button>
            </fieldset>
            { error && <span className="form-error">User does not exist or wrong password</span> }
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  actions: PropTypes.shape({
    getToken: PropTypes.func.isRequired,
  }).isRequired,
  ...propTypes,
};

export default connect(null, dispatch => ({ actions: bindActionCreators({ getToken }, dispatch) }))(
  reduxForm({ form: 'LoginForm' })(Login),
  );

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes } from 'redux-form';
import { getToken } from './duck';

const Login = ({ error, handleSubmit, actions }) => (
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

Login.propTypes = {
  actions: PropTypes.shape({
    getToken: PropTypes.func.isRequired,
  }).isRequired,
  ...propTypes,
};

export default connect(null, dispatch => ({ actions: bindActionCreators({ getToken }, dispatch) }))(
  reduxForm({ form: 'LoginForm' })(Login),
  );

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import request from '../../api';
import * as ownActions from './duck';
import { clickListener } from '../../ducks/flashMessage';
import NavbarHeader from './components/NavbarHeader';
import FlashMsg from './components/FlashMsg';
import LoadingLine from './components/LoadingLine';

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = { checking: false };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location = '/login';
    }

    this.setState({ checking: true });

    request('/api/admin/testaccess', { headers: { authorization: token } })
      .then(() => {
        this.setState({ checking: false });
        this.props.actions.authUser();
      })
      .catch((err) => {
        this.setState({ checking: false });

        if (err.status === 401) {
          localStorage.removeItem('token');
          window.location = '/login';
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authenticated && !nextProps.authenticated) {
      window.location = '/login';
    }
  }

  render() {
    const { authenticated, actions, children } = this.props;
    const divProps = { onClick: actions.clickListener };

    if (this.state.checking) return <div>Checking status...</div>;
    if (!authenticated) return null;

    return (
      <div {...divProps}>
        <LoadingLine />
        <NavbarHeader unAuthUser={actions.unAuthUser} />
        <div className="container main-container">
          <FlashMsg />
          {children}
        </div>
      </div>
    );
  }
}

Base.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    authUser: PropTypes.func.isRequired,
    unAuthUser: PropTypes.func.isRequired,
    clickListener: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

function mapStateToProps({ base: { authenticated } }) {
  return { authenticated };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...ownActions, clickListener }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Base);

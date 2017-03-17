import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const LoadingSignal = ({ active }) => {
  if (active) {
    return <div className="signal" />;
  }
  return <div className="nav-noop" />;
};

LoadingSignal.propTypes = {
  active: PropTypes.bool.isRequired,
};

function mapStateToProps({ domain }) {
  const active = Object.values(domain).some(dom => (dom && dom.activeRequests > 0));

  return { active };
}

export default connect(mapStateToProps)(LoadingSignal);

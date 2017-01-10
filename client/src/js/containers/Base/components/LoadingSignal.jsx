import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const LoadingSignal = ({ active }) => {
  if (active) {
    return <div className="signal" />;
  }
  return <div className="nav-noop" />;
};

LoadingSignal.propTypes = {
  active: PropTypes.bool,
};

function mapStateToProps({ domain }) {
  // const active = Object.values(domain).some(dom => (dom && dom.pending));

  return { active: false };
}

export default connect(mapStateToProps)(LoadingSignal);

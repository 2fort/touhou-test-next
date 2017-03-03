import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ProgressBar from 'react-progress-bar-plus';

const LoadingLine = ({ active }) => {
  if (!active) return null;

  return (
    <ProgressBar onTop percent={0} autoIncrement intervalTime={100} />
  );
};

LoadingLine.propTypes = {
  active: PropTypes.bool.isRequired,
};

function mapStateToProps({ domain }) {
  const active = Object.values(domain).some(dom => (dom && dom.activeRequests > 0));

  return { active };
}

export default connect(mapStateToProps)(LoadingLine);

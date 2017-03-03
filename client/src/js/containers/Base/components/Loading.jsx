import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const Loading = ({ active }) => {
  if (!active) return null;

  return (
    <div className="flex-loading">
      <div>
        <i className="fa fa-refresh fa-spin fa-3x fa-fw" />
      </div>
    </div>
  );
};

Loading.propTypes = {
  active: PropTypes.bool.isRequired,
};

function mapStateToProps({ domain }) {
  const active = Object.values(domain).some(dom => (dom && dom.activeRequests > 0));

  return { active };
}

export default connect(mapStateToProps)(Loading);

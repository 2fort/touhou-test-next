import React, { PropTypes, Component } from 'react';

class EntitiesCounter extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.pending) return false;
    return true;
  }

  render() {
    const { page, limit, length, total, children, pending } = this.props;
    const value = (pending) ? '...' : ((page - 1) * limit) + length;

    return (
      <h4>{value} / <strong>{total}</strong> {children}</h4>
    );
  }
}

EntitiesCounter.defaultProps = {
  page: 0,
  limit: 0,
  length: 0,
  total: 0,
  pending: false,
};

EntitiesCounter.propTypes = {
  page: PropTypes.number,
  limit: PropTypes.number,
  length: PropTypes.number,
  total: PropTypes.number,
  children: PropTypes.string.isRequired,
  pending: PropTypes.bool,
};

export default EntitiesCounter;

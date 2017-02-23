import React, { PropTypes, Component } from 'react';

class EntitiesCounter extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.fetchedAt === nextProps.fetchedAt) return false;
    return true;
  }

  render() {
    const { page, limit, length, total, children } = this.props;
    const first = (page - 1) * limit;
    const second = ((page - 1) * limit) + length;

    return (
      <h4>
        { total ? `${first + 1}–${second}` : 0 } / <strong>{total}</strong> {children}
      </h4>
    );
  }
}

EntitiesCounter.propTypes = {
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
  fetchedAt: PropTypes.number.isRequired,
};

export default EntitiesCounter;

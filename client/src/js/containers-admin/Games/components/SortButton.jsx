import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';

function chooseIcon(field, query, def) {
  const ascIcon = <i className="fa fa-sort-asc" aria-hidden="true" />;
  const descIcon = <i className="fa fa-sort-desc" aria-hidden="true" />;

  if (!query.sort) {
    if (def) return ascIcon;
    return '';
  }

  if (query.sort !== field && query.sort !== `-${field}`) {
    return '';
  }

  if (query.sort.substr(0, 1) === '-') {
    return descIcon;
  }

  return ascIcon;
}

class SortButton extends Component {
  sort = () => {
    const { router: { replace }, location: { pathname, query }, field, def } = this.props;

    if (!query.sort) {
      if (def) {
        replace({ pathname, query: { ...query, sort: `-${field}` } });
      } else {
        replace({ pathname, query: { ...query, sort: field } });
      }
      return;
    }

    if (query.sort === field) {
      replace({ pathname, query: { ...query, sort: `-${field}` } });
      return;
    } else if (query.sort === `-${field}`) {
      replace({ pathname, query: { ...query, sort: field } });
      return;
    }

    replace({ pathname, query: { ...query, sort: field } });
  }

  render() {
    const { location: { query }, field, children, def } = this.props;

    const icon = chooseIcon(field, query, def);

    return (
      <button type="button" className="blank" onClick={this.sort}>
        {icon} <span className="sort">{children}</span>
      </button>
    );
  }
}

SortButton.defaultProps = {
  def: false,
};

SortButton.propTypes = {
  def: PropTypes.bool,
  field: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SortButton);

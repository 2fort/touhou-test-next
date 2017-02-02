import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

class Pagination extends Component {
  handleSelect = (eventKey) => {
    const { location: { pathname, query }, router: { replace } } = this.props;
    replace({ pathname, query: { ...query, page: eventKey } });
  }

  render() {
    const { location: { query: { page, limit } }, total } = this.props;

    const perPage = Number(limit) || 10;
    const pages = Math.ceil(total / perPage);

    const activePage = Number(page) || 1;

    return (
      <BootstrapPagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        items={pages}
        maxButtons={5}
        activePage={activePage}
        onSelect={this.handleSelect}
      />
    );
  }
}

Pagination.propTypes = {
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }).isRequired,
  total: PropTypes.number.isRequired,
};

export default withRouter(Pagination);

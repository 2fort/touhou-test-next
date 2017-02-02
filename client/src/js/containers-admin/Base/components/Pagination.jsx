import React, { PropTypes, Component } from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

class Pagination extends Component {
  handleSelect = (eventKey) => {
    this.props.setPage(eventKey);
  }

  render() {
    const { page, total, limit } = this.props;
    const pages = Math.ceil(total / limit);
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

Pagination.defaultProps = {
  page: 1,
  total: 0,
  limit: 10,
};

Pagination.propTypes = {
  page: PropTypes.number,
  total: PropTypes.number,
  limit: PropTypes.number,
  setPage: PropTypes.func.isRequired,
};

export default Pagination;

import React, { PropTypes, Component } from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

class Pagination extends Component {
  componentWillReceiveProps(nextProps) {
    const { page, limit, total } = nextProps;

    if (total !== this.props.total && (page - 1) * limit > total) {
      this.props.setPage(1);
    }
  }

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

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Pagination;

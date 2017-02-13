import React, { Component, PropTypes } from 'react';

function chooseIcon(field, reduxField) {
  const ascIcon = <i className="fa fa-sort-asc" aria-hidden="true" />;
  const descIcon = <i className="fa fa-sort-desc" aria-hidden="true" />;

  if (reduxField !== field && reduxField !== `-${field}`) {
    return '';
  }

  if (reduxField.substr(0, 1) === '-') {
    return descIcon;
  }

  return ascIcon;
}

class SortButtonExp extends Component {
  sort = () => {
    const { field, reduxField, setSort } = this.props;

    if (field === reduxField) {
      setSort(`-${field}`);
      return;
    } else if (field === `-${reduxField}`) {
      setSort(field);
      return;
    }

    setSort(field);
  }

  render() {
    const { field, reduxField, children } = this.props;

    const icon = chooseIcon(field, reduxField);

    return (
      <button type="button" className="blank" onClick={this.sort}>
        {icon} <span className="sort">{children}</span>
      </button>
    );
  }
}

SortButtonExp.defaultProps = {
  reduxField: '',
};

SortButtonExp.propTypes = {
  field: PropTypes.string.isRequired,
  reduxField: PropTypes.string,
  children: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default SortButtonExp;

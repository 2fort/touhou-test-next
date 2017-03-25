import React, { Component, PropTypes } from 'react';
import * as style from './SortButton.style';

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

class SortButton extends Component {
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
      <button type="button" className={style.blank} onClick={this.sort}>
        {icon} <span className={style.sort}>{children}</span>
      </button>
    );
  }
}

SortButton.defaultProps = {
  reduxField: '',
};

SortButton.propTypes = {
  field: PropTypes.string.isRequired,
  reduxField: PropTypes.string,
  children: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default SortButton;

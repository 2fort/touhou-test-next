import React, { Component, PropTypes } from 'react';
import flatten from 'flat';

const unflatten = require('flat').unflatten;

class ActiveFilters extends Component {
  btnHandler = key => () => {
    const flattenFilters = flatten(this.props.filters);
    delete flattenFilters[key];
    const filters = unflatten(flattenFilters);
    this.props.setFilter(filters);
  }

  render() {
    const { filters } = this.props;

    const flattenFilters = flatten(filters);
    const buttons = [];

    Object.keys(flattenFilters).forEach((key) => {
      buttons.push(
        <button
          key={key}
          onClick={this.btnHandler(key)}
          type="button"
          className="btn btn-default"
          style={{ marginLeft: '7px' }}
        >
          {key} <b>is</b> {flattenFilters[key]}<span className="close-sign">✕</span>
        </button>,
      );
    });

    return (
      <div style={{ display: 'inline' }}>
        {buttons}
      </div>
    );
  }
}

ActiveFilters.defaultProps = {
  filters: {},
};

ActiveFilters.propTypes = {
  filters: PropTypes.objectOf(PropTypes.any),
  setFilter: PropTypes.func.isRequired,
};

export default ActiveFilters;

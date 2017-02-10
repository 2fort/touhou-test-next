import React, { Component, PropTypes } from 'react';

class ActiveFilters extends Component {
  btnHandler = key => () => {
    const filters = Object.assign({}, this.props.filters);
    delete filters[key];
    this.props.setFilter(filters);
  }

  render() {
    const { filters } = this.props;
    const buttons = [];

    Object.keys(filters).forEach((key) => {
      buttons.push(
        <button
          key={key}
          onClick={this.btnHandler(key)}
          type="button"
          className="btn btn-default"
          style={{ marginLeft: '7px' }}
        >
          {key} <b>is</b> {filters[key]}<span className="close-sign">✕</span>
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
  filters: PropTypes.shape({
    title: PropTypes.string,
    year: PropTypes.string,
  }),
  setFilter: PropTypes.func.isRequired,
};

export default ActiveFilters;

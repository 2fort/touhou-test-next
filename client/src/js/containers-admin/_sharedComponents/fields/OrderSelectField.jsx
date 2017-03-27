import React, { PropTypes } from 'react';
import { classes, style } from 'typestyle';
import * as csstips from 'csstips';

const main = style(csstips.horizontal, csstips.center);
const label = style(csstips.selfStart);

const OrderSelectField = ({ input, list, max }) => (
  <div className={classes(main, 'form-group')}>
    <label htmlFor="link.order" className={classes(label, 'col-sm-2 control-label')}>
      Order
    </label>
    <div className="col-sm-9">
      {list}
    </div>
    <div className="col-sm-1">
      <button
        type="button"
        className="btn btn-default"
        onClick={() => input.onChange(input.value - 1)}
        disabled={input.value === 1}
      >
        <i className="fa fa-chevron-up" aria-hidden="true" />
      </button>
      <br /> <br />
      <button
        type="button"
        className="btn btn-default"
        onClick={() => input.onChange(input.value + 1)}
        disabled={input.value === max}
      >
        <i className="fa fa-chevron-down" aria-hidden="true" />
      </button>
    </div>
  </div>
);

OrderSelectField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  list: PropTypes.node.isRequired,
  max: PropTypes.number.isRequired,
};

export default OrderSelectField;

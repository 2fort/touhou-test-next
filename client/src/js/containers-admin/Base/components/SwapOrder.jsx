import React, { PropTypes } from 'react';

const SwapOrder = ({ id, order, total, orderFunc }) => (
  <div>
    <button
      type="button"
      className="btn btn-link"
      onClick={orderFunc(id, order - 1)}
      disabled={order === 1}
    >
      <i className="fa fa-sort-asc" aria-hidden="true" />
    </button>
    {order}
    <button
      type="button"
      className="btn btn-link"
      onClick={orderFunc(id, order + 1)}
      disabled={order === total}
    >
      <i className="fa fa-sort-desc" aria-hidden="true" />
    </button>
  </div>
);

SwapOrder.propTypes = {
  id: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  orderFunc: PropTypes.func.isRequired,
};

export default SwapOrder;

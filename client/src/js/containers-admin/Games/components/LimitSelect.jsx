import React, { PropTypes } from 'react';

const LimitSelect = ({ limit, setLimit }) => (
  <select className="form-control" value={limit} name="limit" onChange={(e) => { setLimit(Number(e.target.value)); }}>
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
  </select>
);

LimitSelect.defaultProps = {
  limit: 10,
};

LimitSelect.propTypes = {
  limit: PropTypes.number,
  setLimit: PropTypes.func.isRequired,
};

export default LimitSelect;


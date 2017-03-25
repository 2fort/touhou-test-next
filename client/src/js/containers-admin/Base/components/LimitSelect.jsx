import React, { PropTypes } from 'react';
import { style } from 'typestyle';

const LimitSelect = ({ limit, setLimit }) => (
  <div>
    <label className={style({ marginLeft: '15px' })} htmlFor="limit">
      Per page:
    </label>
    {' '}
    <select className="form-control" value={limit} name="limit" onChange={(e) => { setLimit(Number(e.target.value)); }}>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  </div>
);

LimitSelect.defaultProps = {
  limit: 10,
};

LimitSelect.propTypes = {
  limit: PropTypes.number,
  setLimit: PropTypes.func.isRequired,
};

export default LimitSelect;


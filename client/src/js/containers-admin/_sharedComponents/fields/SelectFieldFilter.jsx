import React, { PropTypes } from 'react';

const SelectFieldFilter = ({ input, label, meta: { touched, error }, disabled, checkboxTrigger, optionsSelect }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <div className="input-group">
        <span className="input-group-addon">
          <input checked={!disabled} onChange={() => checkboxTrigger(input.name)} type="checkbox" />
        </span>
        <select className="form-control" disabled={disabled} {...input}>
          <option />
          {optionsSelect}
        </select>
      </div>
      {touched && (error && <span>{error}</span>)}
    </div>
  </div>
);

SelectFieldFilter.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
  checkboxTrigger: PropTypes.func.isRequired,
  optionsSelect: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default SelectFieldFilter;

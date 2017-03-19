import React, { PropTypes } from 'react';

const CheckboxField = ({ input, label, meta: { touched, error }, disabled }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <span style={{ display: 'flex', marginTop: '6px' }}>
        <input disabled={disabled} {...input} type="checkbox" checked={input.value} />
      </span>
      {touched && (error && <span className="form-error">{error}</span>)}
    </div>
  </div>
);

CheckboxField.defaultProps = {
  disabled: false,
  placeholder: true,
};

CheckboxField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default CheckboxField;

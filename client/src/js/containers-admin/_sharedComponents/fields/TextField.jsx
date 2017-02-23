import React, { PropTypes } from 'react';

const TextField = ({ input, label, placeholder, type, meta: { touched, error }, disabled }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <input className="form-control" disabled={disabled} {...input} placeholder={placeholder ? label : ''} type={type} />
      {touched && (error && <span>{error}</span>)}
    </div>
  </div>
);

TextField.defaultProps = {
  disabled: false,
  placeholder: true,
};

TextField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.bool,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default TextField;

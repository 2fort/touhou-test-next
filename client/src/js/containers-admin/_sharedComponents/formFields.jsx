import React, { PropTypes } from 'react';

export const textField = ({ input, label, disabled, type, meta: { touched, error } }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <input className="form-control" disabled={disabled} {...input} placeholder={label} type={type} />
      {touched && (error && <span>{error}</span>)}
    </div>
  </div>
);

export const imageField = ({ input, label, imgRoot, currentImage, type, meta: { touched, error } }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <img alt="character" src={imgRoot + currentImage} style={{ marginBottom: 5 }} />
      <input
        {...input}
        type={type}
        className="pure-input-2-3"
      />
      {touched && (error && <span>{error}</span>)}
    </div>
  </div>
);

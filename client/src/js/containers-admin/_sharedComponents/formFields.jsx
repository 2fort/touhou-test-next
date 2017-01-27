import React, { Component, PropTypes } from 'react';

export const textField = ({ input, label, type, meta: { touched, error }, disabled }) => (
  <div className="form-group">
    <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <input className="form-control" disabled={disabled} {...input} placeholder={label} type={type} />
      {touched && (error && <span>{error}</span>)}
    </div>
  </div>
);

textField.defaultProps = {
  disabled: false,
};

textField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export class imageField extends Component {
  addImgBtnHandler = () => {
    this.fileInput.click();
  }

  removeImgBtnHandler = () => {
    this.props.removeImgPreview();
    this.props.input.onChange({});
  }

  fileSelectHandler = (e) => {
    const files = e.target.files;
    if (files[0]) {
      this.props.input.onChange(e.target.files);
      this.props.addImgPreview(e.target.files[0]);
    }
  }

  render() {
    const { input, label, type, meta: { touched, error }, currentImage } = this.props;

    const imageBlock = (
      <div>
        <img alt="cover" src={currentImage} />
        <br />
        <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Replace</button>
        {' '}
        <button type="button" className="btn btn-danger" onClick={this.removeImgBtnHandler}>Remove</button>
      </div>
    );

    return (
      <div className="form-group">
        <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
        <div className="col-sm-10 form-image">
          <input
            {...input}
            type={type}
            className="pure-input-2-3"
            style={{ display: 'none' }}
            onChange={this.fileSelectHandler}
            ref={(file) => { this.fileInput = file; }}
          />

          {this.props.currentImage
            ? imageBlock
            : <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Add</button>
          }

          {touched && (error && <span>{error}</span>)}
        </div>
      </div>
    );
  }
}

imageField.defaultProps = {
  currentImage: '',
};

imageField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  currentImage: PropTypes.string,
  addImgPreview: PropTypes.func.isRequired,
  removeImgPreview: PropTypes.func.isRequired,
};

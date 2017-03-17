import React, { Component, PropTypes } from 'react';
import { IMG_THUMBNAIL } from '../../../config';

export default class ImageField extends Component {
  addImgBtnHandler = () => {
    this.fileInput.click();
  }

  removeImgBtnHandler = () => {
    this.props.filePreview.revoke();
    this.props.input.onChange('');
  }

  fileSelectHandler = (e) => {
    this.props.input.onBlur();
    const files = e.target.files;
    if (files[0]) {
      this.props.filePreview.revoke();
      this.props.filePreview.add(files[0]);
      this.props.input.onChange(files);
    }
  }

  render() {
    const { input: { value, ...input }, label, type, meta: { touched, error }, filePreview } = this.props;

    const defaultImage = value && typeof value === 'string' ? IMG_THUMBNAIL + value : null;

    const imageBlock = (
      <div>
        <img alt="preview" src={filePreview.blob || defaultImage || '/images/file-o.svg'} />
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

          {value
            ? imageBlock
            : <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Add</button>
          }

          {touched && (error && <span className="form-error">{error}</span>)}
        </div>
      </div>
    );
  }
}

ImageField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    pristine: PropTypes.bool,
  }).isRequired,
  filePreview: PropTypes.shape({
    add: PropTypes.func.isRequired,
    revoke: PropTypes.func.isRequired,
    blob: PropTypes.string.isRequired,
  }).isRequired,
};

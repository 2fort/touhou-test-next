import React, { Component, PropTypes } from 'react';
import { style } from 'typestyle';
import { important } from 'csx';
import ErrorSpan from '../ErrorSpan';

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

    const defaultImage = value && typeof value === 'string' ? process.env.IMG_THUMBNAIL + value : null;

    const imageBlock = (
      <div>
        <img
          alt="preview"
          src={filePreview.blob || defaultImage || '/images/file-o.svg'}
          className={style({ maxWidth: '250px', maxHeight: '150px', marginBottom: '5px' })}
        />
        <br />
        <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Replace</button>
        {' '}
        <button type="button" className="btn btn-danger" onClick={this.removeImgBtnHandler}>Remove</button>
      </div>
    );

    return (
      <div className="form-group">
        <label htmlFor={input.name} className="col-sm-2 control-label">{label}</label>
        <div className="col-sm-10">
          <input
            {...input}
            type={type}
            className={style({ display: important('none') })}
            onChange={this.fileSelectHandler}
            ref={(file) => { this.fileInput = file; }}
          />

          {value
            ? imageBlock
            : <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Add</button>
          }

          {touched && (error && <ErrorSpan>{error}</ErrorSpan>)}
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

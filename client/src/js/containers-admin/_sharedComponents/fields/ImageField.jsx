import React, { Component, PropTypes } from 'react';
import { IMG_THUMBNAIL } from '../../../config';

export default class ImageField extends Component {
  constructor(props) {
    super(props);
    this.initialImage = props.currentImage ? IMG_THUMBNAIL + props.currentImage : '';
    this.state = { imgPreview: this.initialImage };
  }

  componentWillReceiveProps = (newProps) => {
    if (!this.props.meta.pristine && newProps.meta.pristine) {
      this.revokeImgPreview();
      this.setState({ imgPreview: this.initialImage });
    }
  }

  getImgPreview = () => this.state.imgPreview;

  revokeImgPreview = () => {
    const { imgPreview } = this.state;
    if (imgPreview && imgPreview.substring(0, 4) === 'blob') {
      window.URL.revokeObjectURL(this.state.imgPreview);
    }
  }

  addImgBtnHandler = () => {
    this.fileInput.click();
  }

  removeImgBtnHandler = () => {
    this.revokeImgPreview();
    this.setState({ imgPreview: '' });
    this.props.input.onChange({});
  }

  fileSelectHandler = (e) => {
    this.revokeImgPreview();
    const files = e.target.files;
    if (files[0]) {
      this.props.input.onChange(files);
      this.setState({ imgPreview: window.URL.createObjectURL(files[0]) });
    }
  }

  render() {
    const { input, label, type, meta: { touched, error } } = this.props;

    const validInput = Object.assign(input, { value: undefined });

    const imageBlock = (
      <div>
        <img alt="preview" src={this.state.imgPreview} />
        <br />
        <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Replace</button>
        {' '}
        <button type="button" className="btn btn-danger" onClick={this.removeImgBtnHandler}>Remove</button>
      </div>
    );

    return (
      <div className="form-group">
        <label htmlFor={validInput.name} className="col-sm-2 control-label">{label}</label>
        <div className="col-sm-10 form-image">
          <input
            {...validInput}
            type={type}
            className="pure-input-2-3"
            style={{ display: 'none' }}
            onChange={this.fileSelectHandler}
            ref={(file) => { this.fileInput = file; }}
          />

          {this.state.imgPreview
            ? imageBlock
            : <button type="button" className="btn btn-primary" onClick={this.addImgBtnHandler}>Add</button>
          }

          {touched && (error && <span>{error}</span>)}
        </div>
      </div>
    );
  }
}

ImageField.defaultProps = {
  currentImage: '',
};

ImageField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    pristine: PropTypes.bool,
  }).isRequired,
  currentImage: PropTypes.string,
};

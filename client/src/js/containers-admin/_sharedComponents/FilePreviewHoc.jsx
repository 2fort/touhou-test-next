import React, { Component } from 'react';

export default (ComposedComponent) => {
  class FilePreviewHoc extends Component {
    constructor(props) {
      super(props);
      this.state = { blob: '' };
    }

    componentWillUnmount() {
      this.revoke();
    }

    add = (file) => {
      this.setState({ blob: window.URL.createObjectURL(file) });
    }

    revoke = () => {
      const { blob } = this.state;
      if (blob) {
        window.URL.revokeObjectURL(blob);
        this.setState({ blob: '' });
      }
    }

    blobTest = (string) => {
      if (string.substring(0, 4) === 'blob') {
        return true;
      }
      return false;
    }

    render() {
      return (
        <ComposedComponent
          filePreview={{
            add: this.add,
            revoke: this.revoke,
            blob: this.state.blob,
            blobTest: this.blobTest,
          }}
          {...this.props}
        />
      );
    }
  }

  return FilePreviewHoc;
};


import React, { Component, PropTypes } from 'react';

class CharacterEdit extends Component {
  render() {
    return (
      <div>
        <button type="button" className="btn btn-default" onClick={this.props.router.goBack}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
}

export default CharacterEdit;

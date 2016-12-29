import React, { Component, PropTypes } from 'react';

export default class CharacterImage extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.image !== this.props.image) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className="character-image">
        <img alt="character" src={`/images/m/${this.props.image}`} />
      </div>
    );
  }
}

CharacterImage.propTypes = {
  image: PropTypes.string.isRequired,
};

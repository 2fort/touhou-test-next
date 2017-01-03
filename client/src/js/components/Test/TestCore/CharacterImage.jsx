import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CharacterImage extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.structure.image !== this.props.structure.image) {
      return true;
    }
    return false;
  }
  render() {
    const { baseDir, image } = this.props.structure;
    return (
      <div className="character-image">
        <img alt="character" src={baseDir + image} />
      </div>
    );
  }
}

function mapStateToProps({ main: { steps, activeStep } }) {
  const structure = {
    baseDir: '/images/m/',
    image: steps[activeStep - 1].image,
  };

  return { structure };
}

CharacterImage.propTypes = {
  structure: PropTypes.shape({
    baseDir: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(CharacterImage);

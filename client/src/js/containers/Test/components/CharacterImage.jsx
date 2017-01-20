import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IMG_COMPRESSED } from '../../../config';

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
        {image
          ? <img alt="character" src={baseDir + image} />
          : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" />
        }
      </div>
    );
  }
}

function mapStateToProps({ domain: { test: { steps, activeStep } } }) {
  const structure = {
    baseDir: IMG_COMPRESSED,
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

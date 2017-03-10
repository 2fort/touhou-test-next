import React, { PropTypes } from 'react';
import { IMG_COMPRESSED } from '../../../config';

const CharacterImage = ({ steps, activeStep }) => {
  const image = steps[activeStep - 1].image;
  return (
    <div className="character-image">
      {image
        ? <img alt="character" src={IMG_COMPRESSED + image} />
        : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" />
      }
    </div>
  );
};

CharacterImage.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default CharacterImage;

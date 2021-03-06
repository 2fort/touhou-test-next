import React, { PropTypes } from 'react';
import * as style from './Image.style';

const Image = ({ steps, activeStep }) => {
  const image = steps[activeStep - 1].image;
  return (
    <div className={style.imgContainer}>
      <div className={style.innerContainer}>
        {image
          ? <img className={style.img} key={image} alt="character" src={process.env.IMG_COMPRESSED + image} />
          : <i className="fa fa-file-image-o fa-5x" aria-hidden="true" />
        }
      </div>
    </div>
  );
};

Image.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default Image;

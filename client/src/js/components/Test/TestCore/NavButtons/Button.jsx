import React, { PropTypes } from 'react';

const Button = ({ structure, onButtonClick, children }) => {
  const color = structure.disabled ? 'disabled' : structure.color;

  return (
    <div className="navigation">
      <button type="button" className={color} onClick={onButtonClick}>
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  structure: PropTypes.shape({
    color: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  onButtonClick: PropTypes.func,
  children: PropTypes.node,
};

export default Button;

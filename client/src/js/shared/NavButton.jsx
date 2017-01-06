import React, { PropTypes } from 'react';

const NavButton = ({ structure: { color, disabled }, onButtonClick, children }) => (
  <div className="navigation">
    <button disabled={disabled} type="button" className={color} onClick={onButtonClick}>
      {children}
    </button>
  </div>
);

NavButton.propTypes = {
  structure: PropTypes.shape({
    color: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  onButtonClick: PropTypes.func,
  children: PropTypes.node,
};

export default NavButton;

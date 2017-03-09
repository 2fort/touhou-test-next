import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NavButton = ({ disabled, to, arrow }) => {
  if (disabled) {
    return (
      <div className="navigation">
        {arrow === 'left'
          ? <button type="button" disabled>&nbsp;&lt;&nbsp;</button>
          : <button type="button" disabled>&nbsp;&gt;&nbsp;</button>
        }
      </div>
    );
  }

  return (
    <div className="navigation">
      {arrow === 'left'
        ? <Link to={to}>&nbsp;&lt;&nbsp;</Link>
        : <Link to={to}>&nbsp;&gt;&nbsp;</Link>
      }
    </div>
  );
};

const NavButtons = {
  Left: function Left(props) {
    return <NavButton arrow="left" {...props} />;
  },
  Right: function Right(props) {
    return <NavButton arrow="right" {...props} />;
  },
};

NavButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  arrow: PropTypes.string.isRequired,
};

export default NavButtons;

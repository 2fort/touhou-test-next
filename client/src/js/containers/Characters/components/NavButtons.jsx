import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as style from '../../Test/components/NavButtons.style';

const NavButton = ({ disabled, to, arrow }) => {
  if (disabled) {
    return (
      <div className={style.navContainer}>
        {arrow === 'left'
          ? <button className={style.navItem} type="button" disabled>&nbsp;&lt;&nbsp;</button>
          : <button className={style.navItem} type="button" disabled>&nbsp;&gt;&nbsp;</button>
        }
      </div>
    );
  }

  return (
    <div className={style.navContainer}>
      {arrow === 'left'
        ? <Link className={style.navItem} to={to}>&nbsp;&lt;&nbsp;</Link>
        : <Link className={style.navItem} to={to}>&nbsp;&gt;&nbsp;</Link>
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

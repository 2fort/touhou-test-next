import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { clickListener } from '../../ducks/flashMessage';
import NavbarHeader from './components/NavbarHeader';
import FlashMsg from './components/FlashMsg';
import LoadingLine from './components/LoadingLine';

const Base = props => (
  <div onClick={props.clickListener}>
    <LoadingLine />
    <NavbarHeader />
    <div className="container main-container">
      <FlashMsg />
      {props.children}
    </div>
  </div>
);

Base.propTypes = {
  clickListener: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(null, { clickListener })(Base);

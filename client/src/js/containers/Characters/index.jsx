import React, { PropTypes } from 'react';
import Loading from '../Base/components/Loading';

const Characters = ({ children }) => (
  <div className="simple-container">
    {children}
    <Loading />
  </div>
);

Characters.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Characters;

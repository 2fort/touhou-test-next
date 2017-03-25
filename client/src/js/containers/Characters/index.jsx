import React, { PropTypes } from 'react';
import Loading from '../Base/components/Loading';
import Container from '../Base/components/Container';

const Characters = ({ children }) => (
  <Container>
    {children}
    <Loading />
  </Container>
);

Characters.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Characters;

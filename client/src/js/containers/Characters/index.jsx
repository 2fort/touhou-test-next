import React, { PropTypes } from 'react';

import Breadcrumbs from './components/Breadcrumbs';
import ModeButtons from './components/ModeButtons';
import Loading from '../Base/components/Loading';

const Characters = ({ router, location, children, params }) => (
  <div className="simple-container">
    <div className="flex-top">
      <Breadcrumbs params={params} />
      {router.isActive(`/characters/${params.game}/${params.char}`) ||
        <ModeButtons router={router} location={location} />
      }
    </div>
    {children}
    <Loading />
  </div>
);

Characters.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    game: PropTypes.string,
    char: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default Characters;

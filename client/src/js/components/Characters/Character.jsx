import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import * as testApi from '../../api';

const Character = ({ params: { char } }) => {
  const charInfo = testApi.getSingleCharInfo(char);
  return (
    <div className="singlechar">
      <Helmet title={charInfo.name} />

      <h1>{charInfo.name}</h1>
      <div className="singlechar-flex">
        <div>
          <img alt="char" src={`/images/m/${charInfo.image}`} />
        </div>
        <div>
          <p>Character info: <a href={charInfo.wiki}>{charInfo.wiki.substring(7)}</a></p>
          <p>Illustration author: <a href={charInfo.art.url}> {charInfo.art.author}</a></p>
        </div>
      </div>
    </div>
  );
};

Character.propTypes = {
  params: PropTypes.object,
};

export default Character;

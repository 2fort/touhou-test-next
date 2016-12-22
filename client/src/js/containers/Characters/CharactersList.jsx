import React, { PropTypes } from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';

import * as testApi from '../../api';

import ListHoc from './ListHoc';
import Grid from '../../components/Characters/CharactersList/Grid';
import Table from '../../components/Characters/CharactersList/Table';

const CharactersList = ({ location: { pathname }, params: { game }, mode }) => {
  const charsFlex = testApi.getAllCharsFromGame(game);

  return (
    <DocumentTitle title={`${testApi.getProperGameTitle(game)} | Touhou`}>
      {mode === 'grid'
        ? <Grid charsFlex={charsFlex} pathname={pathname} snakeCase={_.snakeCase} />
        : <Table charsFlex={charsFlex} pathname={pathname} snakeCase={_.snakeCase} />
      }
    </DocumentTitle>
  );
};

CharactersList.propTypes = {
  params: PropTypes.object,
  location: PropTypes.object,
  mode: PropTypes.string,
  actions: PropTypes.object,
};

export default ListHoc(CharactersList);

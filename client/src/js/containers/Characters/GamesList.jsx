import React, { PropTypes } from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';

import * as testApi from '../../api';

import ListHoc from './ListHoc';
import Grid from '../../components/Characters/GamesList/Grid';
import Table from '../../components/Characters/GamesList/Table';

const GamesList = ({ location: { pathname }, mode }) => {
    const gamesFlex = testApi.getAllGames();
    
    return( 
        <DocumentTitle title="Characters | Touhou">
            {mode === 'grid'
                ? <Grid gamesFlex={gamesFlex} pathname={pathname} snakeCase={_.snakeCase} />
                : <Table gamesFlex={gamesFlex} pathname={pathname} snakeCase={_.snakeCase} />
            }
        </DocumentTitle>
    );
}

GamesList.propTypes = {
    location: PropTypes.object,
    mode: PropTypes.string,
};

export default ListHoc(GamesList);

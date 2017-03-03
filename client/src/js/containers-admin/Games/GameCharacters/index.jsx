import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { domainHoc } from '../../../ducks/domain';
import QueryStringHOC from '../../Base/hocs/QueryStringHOC';
import * as ownActions from './duck';
import { IMG_THUMBNAIL } from '../../../config';

import CharFormModal from '../../Characters/components/CharFormModal';
import SortButton from '../../Base/components/SortButton';
import Pagination from '../../Base/components/Pagination';
import LimitSelect from '../../Base/components/LimitSelect';
import EntitiesCounter from '../../Base/components/EntitiesCounter';
import FilterPanel from '../../Base/components/FilterPanel';

class GameCharactersTable extends Component {
  
}

function mapStateToProps({ entities, domain: { gameCharactersTable } }) {
  const charsArray = gameCharactersTable.visible.map(char => entities.characters[char]);

  const filterFields = {
    name: {
      type: 'text',
      label: 'Name',
      validation: ['minLength2'],
    },
    'art.author': {
      type: 'text',
      label: 'Art Author',
      canBeBlank: true,
    },
  };

  return { ...gameCharactersTable, filterFields, charsArray, gamesList: entities.games };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
  };
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    domainHoc({ name: 'GameCharactersTable' })(
      QueryStringHOC(GameCharactersTable),
    ),
  );

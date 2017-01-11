import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Breadcrumbs = ({ structure, nothing }) => {
  if (nothing) {
    return <div className="breadcrumbs">{' '}</div>;
  }

  const breadcrumbs = structure.map((level) => {
    if (level.url) {
      return <Link key={level.name} to={level.url}>{level.name}</Link>;
    }
    return <span key={level.name}>{level.name}</span>;
  })
  .reduce((prev, curr) => [prev, ' / ', curr]);

  return <div className="breadcrumbs">{breadcrumbs}</div>;
};

Breadcrumbs.defaultProps = {
  structure: undefined,
  nothing: false,
};

Breadcrumbs.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object),
  nothing: PropTypes.bool,
};

function mapStateToProps({ entities: { games, characters } }, ownProps) {
  const structure = [];
  structure.push({ name: 'Characters', url: '/characters' }); // lvl1

  if (Object.keys(games).length === 0 && Object.keys(characters).length === 0) {
    return { nothing: true };
  }

  const paramsArray = Object.values(ownProps.params);

  if (paramsArray[0]) { // game
    const lvl2 = Object.values(games).filter(game => game.slug === paramsArray[0]);
    if (lvl2[0]) { // if game was found
      structure.push({ name: lvl2[0].title, url: `${structure[0].url}/${paramsArray[0]}` });
    }
  }

  if (paramsArray[1]) { // char
    const lvl3 = Object.values(characters).filter(char => char.slug === paramsArray[1]);
    if (lvl3[0]) { // if char was found
      structure.push({ name: lvl3[0].name, url: `${structure[1].url}/${paramsArray[1]}` });
    }
  }

  structure[structure.length - 1].url = '';

  return ({ structure });
}

export default connect(mapStateToProps)(Breadcrumbs);

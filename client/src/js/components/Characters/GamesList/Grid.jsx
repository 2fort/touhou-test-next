import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const GamesGrid = ({ gamesFlex, pathname, snakeCase }) => {
    const data = gamesFlex.map(game => (
        <div key={game.title} className="flex-item">
            <p>
                <Link className="imagelink" to={`${pathname}/${snakeCase(game.title)}`}>
                    <img alt="char" src={require(`../../../../images/games/${game.cover}`)} />
                </Link>
            </p>
            <p>
                <Link to={`${pathname}/${snakeCase(game.title)}`}>{game.title}</Link>
            </p>
            <p>{game.year}</p>
        </div>
    ));

    return (
        <div className="flex-container">
            {data}
        </div>
    );
};

GamesGrid.propTypes = {
    gamesFlex: PropTypes.array,
    pathname: PropTypes.string,
    snakeCase: PropTypes.func,
};

export default GamesGrid;

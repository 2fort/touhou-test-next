import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const CharactersGrid = ({ charsFlex, pathname, snakeCase }) => {
    const data = charsFlex.map(char => (
        <div key={char.name} className="flex-item">
            <p>
                <Link className="imagelink" to={`${pathname}/${snakeCase(char.name)}`}>
                    <img alt="char" src={require(`../../../../images/s/${char.image}`)} />
                </Link>
            </p>
            <p>
                <Link to={`${pathname}/${snakeCase(char.name)}`}>{char.name}</Link>
            </p>
        </div>
    ));
    return (
        <div className="flex-container">
            {data}
        </div>
    );
};

CharactersGrid.propTypes = {
    charsFlex: PropTypes.array,
    pathname: PropTypes.string,
    snakeCase: PropTypes.func,
};

export default CharactersGrid;

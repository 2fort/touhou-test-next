import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import * as testApi from '../../api';

const Character = ({ params: { char } }) => {
    const charInfo = testApi.getSingleCharInfo(char);
    return (
        <DocumentTitle title={`${charInfo.name} | Touhou`}>
            <div className="singlechar">
                <h1>{charInfo.name}</h1>
                <div className="singlechar-flex">
                    <div>
                        <img alt="char" src={require(`../../../images/m/${charInfo.image}`)} />
                    </div>
                    <div>
                        <p>Character info: <a href={charInfo.wiki}>{charInfo.wiki.substring(7)}</a></p>
                        <p>Illustration author: <a href={charInfo.art.url}> {charInfo.art.author}</a></p>
                    </div>
                </div>
            </div>
        </DocumentTitle>
    );
};

Character.propTypes = {
    params: PropTypes.object,
};

export default Character;

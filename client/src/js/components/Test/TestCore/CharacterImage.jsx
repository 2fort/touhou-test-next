import React, { Component, PropTypes } from 'react';

export default class CharacterImage extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.image !== this.props.image) {
            return true;
        }
        return false;
    }
    render() {
        let img = require(`../../../../images/m/${this.props.image}`);
        return (
            <div className="character-image">
                <img key={img} alt="character" src={img} />
            </div>
        );
    }
}

CharacterImage.propTypes = {
    image: PropTypes.string.isRequired,
};

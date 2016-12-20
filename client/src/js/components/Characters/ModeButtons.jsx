import React, { PropTypes } from 'react';

const ModeButtons = ({ btnChangeMode }) => (
    <div className="modebuttons">
        <button type="button" title="Grid" onClick={() => btnChangeMode('grid')}>
            <i className="fa fa-th-large fa-fw fa-lg" aria-hidden="true" />
            <span className="mobile-hide">Grid</span>
        </button>
        <button type="button" title="Table" onClick={() => btnChangeMode('table')}>
            <i className="fa fa-table fa-fw fa-lg" aria-hidden="true" />
            <span className="mobile-hide">Table</span>
        </button>
    </div>
);

ModeButtons.propTypes = {
    btnChangeMode: PropTypes.func,
};

export default ModeButtons;

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { changeMode } from '../../../actions/charactersActions';

class ModeButtons extends Component {
  componentWillMount() {
    const { router: { replace }, location: { pathname, query }, mode } = this.props;

    if (mode === 'table' && query.mode !== 'table') {
      replace({ pathname, query: { mode: 'table' } });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { router: { replace }, location: { pathname, query }, mode } = nextProps;

    if (mode === 'table' && query.mode !== 'table') {
      replace({ pathname, query: { mode: 'table' } });
    }
  }

  btnChangeMode = btnMode => () => {
    const { router: { replace }, location: { pathname }, changeLayout } = this.props;

    if (btnMode === 'grid') {
      changeLayout('grid');
      replace(pathname);
    } else {
      changeLayout('table');
      replace({ pathname, query: { mode: 'table' } });
    }
  }

  render() {
    return (
      <div className="modebuttons">
        <button type="button" title="Grid" onClick={this.btnChangeMode('grid')}>
          <i className="fa fa-th-large fa-fw fa-lg" aria-hidden="true" />
          <span className="mobile-hide">Grid</span>
        </button>
        <button type="button" title="Table" onClick={this.btnChangeMode('table')}>
          <i className="fa fa-table fa-fw fa-lg" aria-hidden="true" />
          <span className="mobile-hide">Table</span>
        </button>
      </div>
    );
  }
}

ModeButtons.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }),
  mode: PropTypes.string,
  changeLayout: PropTypes.func,
};

function mapStateToProps({ main: { mode } }) {
  return { mode };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLayout: (mode) => {
      dispatch(changeMode(mode));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModeButtons);

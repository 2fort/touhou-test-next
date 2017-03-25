import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { changeMode } from '../../Base/duck';
import * as style from './ModeButtons.style';

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
      <div className={style.btn}>
        <button type="button" title="Grid" onClick={this.btnChangeMode('grid')}>
          <i className="fa fa-th-large fa-fw fa-lg" aria-hidden="true" />
          <span className={style.desktopOnly}>Grid</span>
        </button>
        <button type="button" title="Table" onClick={this.btnChangeMode('table')}>
          <i className="fa fa-table fa-fw fa-lg" aria-hidden="true" />
          <span className={style.desktopOnly}>Table</span>
        </button>
      </div>
    );
  }
}

ModeButtons.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
  changeLayout: PropTypes.func.isRequired,
};

function mapStateToProps({ base: { mode } }) {
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

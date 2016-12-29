import React, { PropTypes, Component } from 'react';
import Link from 'react-router/lib/Link';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetTest } from '../../actions/testActions';

const NavLink = props => <Link activeClassName="active" {...props} />;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  triggerMenu = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  hideMenu = () => {
    this.setState({ expanded: false });
  }

  render() {
    const { resetButtonVisible, actions } = this.props;

    const reloadButton =
      (<button type="button" className="reload" title="Reset" onClick={actions.resetTest}>
        <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
        <span className="mobile-hide"> Reset</span>
      </button>);

    const inButton = this.state.expanded ? ' show' : ' hide';

    return (
      <div className="menu">
        <nav>
          <Link onClick={this.hideMenu} className="logo" to="/">Touhou @ Comiket</Link>
          {resetButtonVisible && reloadButton}
          <button type="button" className="burger" onClick={this.triggerMenu}>
            <i className="fa fa-bars fa-lg" aria-hidden="true" />
          </button>

          <div className={`collapsible${inButton}`}>
            <NavLink onClick={this.hideMenu} to="/test">Test</NavLink>
            <NavLink onClick={this.hideMenu} to="/characters">Characters</NavLink>
            <a href="https://github.com/2fort/touhou-test-jsx">
              <i className="fa fa-github fa-fw fa-lg" aria-hidden="true" /> Github
            </a>
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  resetButtonVisible: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    resetTest: PropTypes.func.isRequired,
  }),
};

function mapStateToProps({ test: { resetButtonVisible } }) {
  return { resetButtonVisible };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ resetTest }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

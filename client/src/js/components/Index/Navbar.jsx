import React, { PropTypes, Component } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { resetTest } from '../../actions/asyncActions';

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
    const { router, onResetButtonClick } = this.props;

    const inButton = this.state.expanded ? 'show' : 'hide';

    return (
      <div className="menu">
        <nav>
          <Link onClick={this.hideMenu} className="logo" to="/">Touhou @ Comiket</Link>

          {router.isActive('/test') &&
            <button type="button" className="reload" title="Reset" onClick={onResetButtonClick}>
              <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
              <span className="mobile-hide"> Reset</span>
            </button>
          }

          <button type="button" className="burger" onClick={this.triggerMenu}>
            <i className="fa fa-bars fa-lg" aria-hidden="true" />
          </button>

          <div className={`collapsible ${inButton}`}>
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
  router: PropTypes.shape({
    isActive: PropTypes.func.isRequired,
  }),
  onResetButtonClick: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onResetButtonClick: () => {
      dispatch(resetTest());
    },
  };
}

export default connect(null, mapDispatchToProps)(withRouter(Navbar));

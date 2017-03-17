import { connect } from 'react-redux';
import React, { PropTypes, Component } from 'react';
import { Link, withRouter } from 'react-router';
import { resetTest as testReset } from '../../Test/duck';
import { resetTest as reverseTestReset } from '../../Test/ReverseTest.duck';

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
    const { router } = this.props;

    const inButton = this.state.expanded ? 'show' : 'hide';

    return (
      <div>
        <div className="menu">
          <nav>
            <Link onClick={this.hideMenu} className="logo" to="/">Touhou @ Comiket</Link>
            &nbsp;<div className="nav-noop" />

            {router.isActive('/test') &&
              <button type="button" className="reload" title="Reset" onClick={() => { this.props.testReset(); }}>
                <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
                <span className="mobile-hide"> Reset</span>
              </button>
            }

            {router.isActive('/reverse-test') &&
              <button type="button" className="reload" title="Reset" onClick={() => { this.props.reverseTestReset(); }}>
                <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
                <span className="mobile-hide"> Reset</span>
              </button>
            }

            <button type="button" className="burger" onClick={this.triggerMenu}>
              <i className="fa fa-bars fa-lg" aria-hidden="true" />
            </button>

            <div className={`collapsible ${inButton}`}>
              <NavLink onClick={this.hideMenu} to="/test">Test</NavLink>
              <NavLink onClick={this.hideMenu} to="/reverse-test">Reverse Test</NavLink>
              <NavLink onClick={this.hideMenu} to="/browse">Browse</NavLink>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  router: PropTypes.shape({
    isActive: PropTypes.func.isRequired,
  }).isRequired,
  testReset: PropTypes.func.isRequired,
  reverseTestReset: PropTypes.func.isRequired,
};

export default connect(null, { testReset, reverseTestReset })(withRouter(Navbar));

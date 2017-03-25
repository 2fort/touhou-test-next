import { connect } from 'react-redux';
import React, { PropTypes, Component } from 'react';
import { Link, withRouter } from 'react-router';

import { resetTest as testReset } from '../../Test/duck';
import { resetTest as reverseTestReset } from '../../Test/ReverseTest.duck';
import * as style from './Navbar.style';

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

    const NavLink = props =>
      <Link
        className={style.link}
        activeClassName={style.active}
        onClick={this.hideMenu}
        {...props}
      />;

    return (
      <div>
        <div className={style.menu}>
          <nav className={style.nav}>
            <Link onClick={this.hideMenu} className={style.logo} to="/">Touhou @ Comiket</Link>
            &nbsp;<div className="nav-noop" />

            {router.isActive('/test') &&
              <button type="button" className={style.reload} onClick={() => { this.props.testReset(); }}>
                <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
                <span className={style.desktopOnly}> Reset</span>
              </button>
            }

            {router.isActive('/reverse-test') &&
              <button type="button" className={style.reload} onClick={() => { this.props.reverseTestReset(); }}>
                <i className="fa fa-fw fa-lg fa-refresh" aria-hidden="true" />
                <span className={style.desktopOnly}> Reset</span>
              </button>
            }

            <button type="button" className={style.burger} onClick={this.triggerMenu}>
              <i className="fa fa-bars fa-lg" aria-hidden="true" />
            </button>

            <div className={this.state.expanded ? style.collapsible : style.collapsibleHidden}>
              <NavLink to="/test">Test</NavLink>
              <NavLink to="/reverse-test">Reverse Test</NavLink>
              <NavLink to="/browse">Browse</NavLink>
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

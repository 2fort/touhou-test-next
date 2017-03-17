import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const NavbarHeader = ({ unAuthUser }) => (
  <Navbar fixedTop inverse collapseOnSelect>
    <div className="container">
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/admin">Touhou-test</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <IndexLinkContainer to="/admin"><NavItem eventKey={1} href="#">Home</NavItem></IndexLinkContainer>
          <LinkContainer to="/admin/games"><NavItem eventKey={2} href="#">Games</NavItem></LinkContainer>
          <LinkContainer to="/admin/characters"><NavItem eventKey={3} href="#">Characters</NavItem></LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={5} href="/" onClick={() => { window.location = '/'; }}>
            <i className="fa fa-arrow-circle-o-left" aria-hidden="true" /> Back to app
          </NavItem>
          <NavItem eventKey={4} href="/" onClick={unAuthUser}>
            Logout <i className="fa fa-sign-out" aria-hidden="true" />
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>
);

NavbarHeader.propTypes = {
  unAuthUser: PropTypes.func.isRequired,
};

export default NavbarHeader;

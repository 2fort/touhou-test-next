import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const NavbarHeader = ({ router }) => (
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
          <IndexLinkContainer to="/admin/games"><NavItem eventKey={2} href="#">Games</NavItem></IndexLinkContainer>
          <IndexLinkContainer to="/admin/characters"><NavItem eventKey={3} href="#">Characters</NavItem></IndexLinkContainer>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={4} href="/" onClick={() => { window.location = '/'; }}>Back to app</NavItem>
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>
);

NavbarHeader.propTypes = {
  router: PropTypes.shape({
    isActive: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NavbarHeader);

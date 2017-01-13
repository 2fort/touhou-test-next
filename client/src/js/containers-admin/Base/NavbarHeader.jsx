import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const NavbarHeader = ({ router }) => {
  return (
    <Navbar inverse collapseOnSelect>
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
            <NavDropdown
              eventKey={2}
              title="Games"
              id="basic-nav-dropdown"
              active={router.isActive('/admin/games')}
            >
              <LinkContainer onlyActiveOnIndex to="/admin/games"><MenuItem eventKey={2.1}>List</MenuItem></LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/admin/games/new"><MenuItem eventKey={2.2}>Add new</MenuItem></LinkContainer>
            </NavDropdown>
            <NavDropdown
              eventKey={3}
              title="Characters"
              id="basic-nav-dropdown"
              active={router.isActive('/admin/characters')}
            >
              <LinkContainer onlyActiveOnIndex to="/admin/characters">
                <MenuItem eventKey={3.1}>List</MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/admin/characters/new"><MenuItem eventKey={3.2}>Add new</MenuItem></LinkContainer>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={4} href="/" onClick={() => { window.location = '/'; }}>Back to site</NavItem>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default withRouter(NavbarHeader);

import React from 'react';
import { Link } from 'react-router';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const NavbarHeader = () => (
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

export default NavbarHeader;

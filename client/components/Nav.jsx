import React from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

import ScienceIcon from '@mui/icons-material/Science'

function App() {
  return (
    <Navbar
      collapseOnSelect
      sticky="top"
      bg="light"
      expand="lg"
      onSelect={() => ({
        collapsed: 'true',
      })}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <ScienceIcon />
          Brew!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/favourites">
              Favourites
            </Nav.Link>
            <Nav.Link as={NavLink} to="/search">
              Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/random">
              Random
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settings">
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default App

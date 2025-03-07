import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import Overview from './components/Overview';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import './App.css';

const App = () => {
  return (
    <>
      <Navbar>
        <Container id = "links">
          <Navbar.Brand>Resume</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">Overview</Nav.Link>
            <Nav.Link as={Link} to="/education">Education</Nav.Link>
            <Nav.Link as={Link} to="/experience">Experience</Nav.Link>
            <Nav.Link as={Link} to="/skills">Skills</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
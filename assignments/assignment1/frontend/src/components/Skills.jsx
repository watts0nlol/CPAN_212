import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../index.css';

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/getSkills').then(res => res.json()).then(setSkills);
  }, []);

  return (
    <Card>
      <h2>Skills</h2>
      <p>{skills.join(', ')}</p>
    </Card>
  );
};

export default Skills;

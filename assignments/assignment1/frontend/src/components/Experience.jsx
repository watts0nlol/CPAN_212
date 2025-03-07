import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../index.css';

const Experience = () => {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/getExp').then(res => res.json()).then(setExperience);
  }, []);

  return (
    <Card>
      <h2>Work Experience</h2>
      {experience.map((exp, index) => (
        <div key={index}>
          <h5>{exp.company}</h5>
          <p>{exp.role} ({exp.year})</p>
        </div>
      ))}
    </Card>
  );
};

export default Experience;


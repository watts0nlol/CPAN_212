import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../index.css';

const Education = () => {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/getEdu').then(res => res.json()).then(setEducation);
  }, []);

  return (
    <Card>
      <h2>Education</h2>
      {education.map((edu, index) => (
        <div key={index}>
          <h5>{edu.school}</h5>
          <p>{edu.degree} ({edu.year})</p>
        </div>
      ))}
    </Card>
  );
};

export default Education;


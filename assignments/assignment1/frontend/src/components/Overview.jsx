import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../index.css';


const Overview = () => {
  const [overview, setOverview] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/getOverview').then(res => res.json()).then(setOverview);
  }, []);

  return (
    <Card>
      <h2>{overview.name}</h2>
      <p>{overview.summary}</p>
    </Card>
  );
};

export default Overview;
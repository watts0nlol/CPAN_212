const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());

const overview = { 
  name: 'Alex Watson', summary: 'A passionate, determined web developer with experience in React, Vite, Node.js and more.' 
};
const education = [
  { school: 'Humber College', degree: 'Computer Science and Analysis Diploma', year: '2024 - 2026' },
  { school: 'St. Elizabeth', degree: 'High School Diploma', year: '2019 - 2023' }
];
const experience = [
  { company: 'Canadian Tire', role: 'Warehouse, Seasonal, Sports', year: '2021 - Present' },
  { company: 'Habitat for Humanity', role: 'Floor', year: '2021 - 2023' }
];
const skills = [
  'JavaScript','React', 'Node.js', 'Express', 'CSS', 'Bootstrap', 'Python', 'Java'

];

app.get('/getOverview', (req, res) => res.json(overview));
app.get('/getEdu', (req, res) => res.json(education));
app.get('/getExp', (req, res) => res.json(experience));
app.get('/getSkills', (req, res) => res.json(skills));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
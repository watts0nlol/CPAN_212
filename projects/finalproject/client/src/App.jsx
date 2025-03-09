import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import PokemonInfo from "../components/PokemonInfo";
import Moves from "../components/Moves";
import Abilities from "../components/Abilities";
import Login from "../components/Login";
import Register from "../components/register";
import "../src/index.css"; // Importing CSS for all pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<PokemonInfo />} />
        <Route path="/moves" element={<Moves />} />
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/pokemon/:name" element={<PokemonInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;


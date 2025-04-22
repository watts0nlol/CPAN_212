import { useState } from "react";
import { Link } from "react-router-dom";
import "../components/PokemonApp.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      localStorage.setItem("loggedInUser", email);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setMessage("Logged out successfully");
  };

  return (
    <div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pokemon">Pokémon Info</Link>
          </li>
          <li>
            <Link to="/moves">Moves</Link>
          </li>
          <li>
            <Link to="/abilities">Abilities</Link>
          </li>
          <li>
            <Link to="/types">Types</Link>
          </li>
          <li>
            <Link to="/team-builder">Teambuilder</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>

        </ul>
      </nav>

      <h1>Login</h1>

      {localStorage.getItem("loggedInUser") ? (
        <div>
          <p>Welcome, {localStorage.getItem("loggedInUser")}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}

      <p>{message}</p>
    </div>
  );
}

export default Login;

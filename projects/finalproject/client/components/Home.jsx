import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <nav>
        <ul>
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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <h1>Welcome to the Pokémon App</h1>
      <p>
        This is a site geared towards all levels of Pokémon trainers; beginners,
        die-hard fans, and the competitive VGC players as well!
      </p>
      <p>
        Here you will be able to access a database of all Pokémon currently
        available, with moves, abilities, and much more.
      </p>
      <p>
        Whether you're just starting your journey or competing in the VGC
        tournaments, this app will help you with everything you need to know
        about Pokémon!
      </p>
    </div>
  );
}

export default Home;

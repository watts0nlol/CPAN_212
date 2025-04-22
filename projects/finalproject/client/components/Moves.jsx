import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/PokemonApp.css";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Moves() {
  const [moveName, setMoveName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allMoves, setAllMoves] = useState([]);
  const [move, setMove] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllMoves = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/move?limit=1000"
        );
        const data = await response.json();
        setAllMoves(data.results.map((m) => m.name));
      } catch (err) {
        console.error("Failed to fetch moves", err);
      }
    };
    fetchAllMoves();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setMoveName(input);

    if (input.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = allMoves.filter((name) =>
        name.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMoveName(formatName(suggestion));
    setSuggestions([]);
  };

  const fetchMove = async () => {
    if (!moveName) return;

    const formattedMove = moveName.toLowerCase().replace(/\s+/g, "-");

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/move/${formattedMove}`
      );
      if (!response.ok) {
        throw new Error(`Move "${moveName}" not found!`);
      }

      const data = await response.json();
      const effectEntry = data.effect_entries.find(
        (entry) => entry.language.name === "en"
      );

      setMove({
        name: formatName(data.name),
        type: formatName(data.type.name),
        accuracy: data.accuracy ?? "N/A",
        power: data.power ?? "N/A",
        pp: data.pp ?? "N/A",
        effect:
          effectEntry?.effect ||
          data.flavor_text_entries.find((entry) => entry.language.name === "en")
            ?.flavor_text ||
          "No effect available.",
      });

      const validPokemon = await filterValidPokemon(data.learned_by_pokemon);
      setPokemonList(validPokemon);
      setError("");
    } catch (error) {
      if (error.message.includes("not found")) {
        setError(`No such move: ${moveName}. Please check the spelling.`);
      } else {
        setError(
          "An error occurred while fetching the move. Please try again."
        );
      }
      setMove(null);
      setPokemonList([]);
    }
  };

  // Optimized function: Fetch Pokémon data in parallel using Promise.all
  const filterValidPokemon = async (pokemonArray) => {
    const fetches = pokemonArray.map(async (pokemon) => {
      try {
        const response = await fetch(pokemon.url);
        const pokemonData = await response.json();

        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();

        if (pokemonData.forms.length === 1 || speciesData.is_battle_only) {
          return {
            name: formatName(pokemon.name),
            sprite: pokemonData.sprites.front_default || "",
          };
        }
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
        return null;
      }
    });

    const results = await Promise.all(fetches);
    return results.filter((p) => p); // Remove null entries
  };

  return (
    <div className="pokemon-info">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pokemon">Pokemon Info</Link>
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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      <h1>Move Search</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Move Name"
          value={moveName}
          onChange={handleInputChange}
          className="pokemon-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(s)}
              >
                {formatName(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={fetchMove}>Search</button>

      {error && <p className="error-message">{error}</p>}

      {move ? (
        <div>
          <h2>Name: {move.name}</h2>
          <p>Type: {move.type}</p>
          <p>Accuracy: {move.accuracy}</p>
          <p>Power: {move.power}</p>
          <p>PP: {move.pp}</p>
          <p>Effect: {move.effect}</p>

          {pokemonList.length > 0 && (
            <div>
              <h3>Pokémon that can learn this move:</h3>
              <ul>
                {pokemonList.map((pokemon, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() =>
                      navigate(`/pokemon/${pokemon.name.toLowerCase()}`)
                    }
                  >
                    <p>{pokemon.name}</p>
                    {pokemon.sprite && (
                      <img src={pokemon.sprite} alt={pokemon.name} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Enter a move name to see its details.</p>
      )}
    </div>
  );
}

export default Moves;

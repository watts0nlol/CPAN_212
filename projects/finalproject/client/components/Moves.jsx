import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Moves() {
  const [moveName, setMoveName] = useState("");
  const [move, setMove] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  // Function to filter valid Pokémon & get sprites
  const filterValidPokemon = async (pokemonArray) => {
    const validPokemon = [];

    for (const pokemon of pokemonArray) {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();

      // Fetch species data
      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();

      if (pokemonData.forms.length === 1 || speciesData.is_battle_only) {
        validPokemon.push({
          name: formatName(pokemon.name),
          sprite: pokemonData.sprites.front_default || "",
        });
      }
    }

    return validPokemon;
  };

  return (
    <div>
      <nav>
        <ul>
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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/team-builder">Teambuilder</Link>
          </li>
        </ul>
      </nav>
      <h1>Move Search</h1>
      <input
        type="text"
        placeholder="Enter Move Name"
        value={moveName}
        onChange={(e) => setMoveName(e.target.value)}
      />
      <button onClick={fetchMove}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
                    onClick={() =>
                      navigate(`/pokemon/${pokemon.name.toLowerCase()}`)
                    }
                    style={{ cursor: "pointer" }}
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

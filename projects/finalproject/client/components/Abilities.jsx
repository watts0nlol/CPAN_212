import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Abilities() {
  const [abilityName, setAbilityName] = useState("");
  const [ability, setAbility] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchAbility = async () => {
    if (!abilityName) return;

    const formattedAbility = abilityName.toLowerCase().replace(/\s+/g, "-");

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/ability/${formattedAbility}`
      );
      if (!response.ok) throw new Error("Ability not found!");

      const data = await response.json();

      const effectEntry = data.effect_entries.find(
        (entry) => entry.language.name === "en"
      );

      const flavorTextEntry = data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );

      setAbility({
        name: formatName(data.name),
        effect:
          effectEntry?.effect ||
          flavorTextEntry?.flavor_text ||
          "No description available.",
      });

      // Fetch valid Pokémon with sprites
      const validPokemon = await filterValidPokemon(data.pokemon);
      setPokemonList(validPokemon);
      setError("");
    } catch (error) {
      setAbility(null);
      setPokemonList([]);
      setError(error.message);
    }
  };

  const filterValidPokemon = async (pokemonArray) => {
    const validPokemon = [];

    for (const entry of pokemonArray) {
      const response = await fetch(entry.pokemon.url);
      const pokemonData = await response.json();

      // Fetch species data
      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();

      if (pokemonData.forms.length === 1 || speciesData.is_battle_only) {
        validPokemon.push({
          name: formatName(entry.pokemon.name),
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
            <Link to="/moves">Moves</Link>
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
      <h1>Ability Search</h1>
      <input
        type="text"
        placeholder="Enter Ability Name"
        value={abilityName}
        onChange={(e) => setAbilityName(e.target.value)}
      />
      <button onClick={fetchAbility}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {ability ? (
        <div>
          <h2>Name: {ability.name}</h2>
          <p>Effect: {ability.effect}</p>

          {pokemonList.length > 0 && (
            <div>
              <h3>Pokémon with this ability:</h3>
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
        <p>Enter an ability name to see its details.</p>
      )}
    </div>
  );
}

export default Abilities;

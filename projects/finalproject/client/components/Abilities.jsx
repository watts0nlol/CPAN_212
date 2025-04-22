import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/PokemonApp.css";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Abilities() {
  const [abilityName, setAbilityName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [abilityList, setAbilityList] = useState([]);

  const [ability, setAbility] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAbilities = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/ability?limit=500"
        );
        const data = await response.json();
        const names = data.results.map((a) => a.name);
        setAbilityList(names);
      } catch (err) {
        console.error("Failed to load abilities", err);
      }
    };

    fetchAllAbilities();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setAbilityName(input);
    if (input.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = abilityList
      .filter((name) => name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (suggestion) => {
    setAbilityName(formatName(suggestion));
    setSuggestions([]);
  };

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
    const pokemonData = await Promise.all(
      pokemonArray.map(async (entry) => {
        try {
          const res = await fetch(entry.pokemon.url);
          const data = await res.json();

          const speciesRes = await fetch(data.species.url);
          const species = await speciesRes.json();

          if (data.forms.length === 1 || species.is_battle_only) {
            return {
              name: formatName(entry.pokemon.name),
              sprite: data.sprites.front_default || "",
            };
          }
        } catch (e) {
          console.error("Failed fetching Pokémon:", entry.pokemon.name, e);
        }

        return null;
      })
    );

    return pokemonData.filter((p) => p !== null);
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
            <Link to="/moves">Moves</Link>
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

      <h1>Ability Search</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Ability Name"
          value={abilityName}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={fetchAbility} className="search-button">
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)}>
                {formatName(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {ability ? (
        <div>
          <h2>Name: {ability.name}</h2>
          <p>Effect: {ability.effect}</p>

          {pokemonList.length > 0 && (
            <div>
              <h3>Pokémon with this ability:</h3>
              <ul className="pokemon-list">
                {pokemonList.map((pokemon, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      navigate(`/pokemon/${pokemon.name.toLowerCase()}`)
                    }
                    className="clickable-pokemon"
                  >
                    <p>{pokemon.name}</p>
                    {pokemon.sprite && (
                      <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className="pokemon-sprite"
                      />
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

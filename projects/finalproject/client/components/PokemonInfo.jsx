import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../components/PokemonApp.css";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function PokemonInfo() {
  const { name } = useParams();
  const [pokemonName, setPokemonName] = useState(name || "");
  const [pokemon, setPokemon] = useState(null);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100000"
        );
        const data = await res.json();
        setAllPokemonNames(data.results.map((p) => p.name));
      } catch (error) {
        console.error("Failed to load Pokémon list", error);
      }
    };
    fetchAllNames();
  }, []);

  useEffect(() => {
    if (name) {
      fetchPokemon(name);
    }
  }, [name]);

  const fetchPokemon = async (searchName) => {
    if (!searchName) return;

    const formattedName = searchName.toLowerCase().replace(/\s+/g, "-");

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${formattedName}`
      );
      if (!response.ok) throw new Error("Pokémon not found!");
      const data = await response.json();

      const abilities = data.abilities.map((a) => ({
        name: formatName(a.ability.name),
        isHidden: a.is_hidden,
      }));

      const stats = data.stats.map((s) => ({
        name: formatName(s.stat.name),
        value: s.base_stat,
      }));

      const totalStats = stats.reduce((sum, s) => sum + s.value, 0);

      setPokemon({
        name: formatName(data.name),
        sprite: data.sprites.front_default,
        shinySprite: data.sprites.front_shiny,
        types: data.types.map((t) => formatName(t.type.name)).join(", "),
        abilities: abilities,
        stats: stats,
        totalStats: totalStats,
      });

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const formRequests = speciesData.varieties.map((variety) =>
        fetch(variety.pokemon.url).then((res) => res.json())
      );
      const formsData = await Promise.all(formRequests);
      const formDetails = formsData
        .map((form) => ({
          name: formatName(form.name),
          sprite: form.sprites.front_default,
        }))
        .filter((form) => form.sprite);

      setForms(formDetails);
      setError("");
    } catch (error) {
      setPokemon(null);
      setForms([]);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setPokemonName(val);
    if (val.length > 0) {
      const filtered = allPokemonNames
        .filter((name) => name.toLowerCase().startsWith(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPokemonName(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="pokemon-info">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      <h1>Pokémon</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Pokémon Name"
          value={pokemonName}
          onChange={handleInputChange}
          className="pokemon-input"
        />
        {pokemonName.length > 0 && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="suggestion-item"
              >
                {formatName(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => fetchPokemon(pokemonName)}>Search</button>

      {error && <p className="error-message">{error}</p>}

      {pokemon ? (
        <div>
          <h2>Name: {pokemon.name}</h2>
          <div className="pokemon-details-container">
            <div className="pokemon-image-section">
              <img
                src={showShiny ? pokemon.shinySprite : pokemon.sprite}
                alt={pokemon.name}
              />
              <br />
              <button onClick={() => setShowShiny(!showShiny)}>
                Show {showShiny ? "Normal" : "Shiny"}
              </button>
              <p>Types: {pokemon.types}</p>
              <p>
                Abilities:{" "}
                {pokemon.abilities
                  .filter((a) => !a.isHidden)
                  .map((a) => a.name)
                  .join(", ")}
              </p>
              <p>
                Hidden Ability:{" "}
                {pokemon.abilities.find((a) => a.isHidden)?.name || "None"}
              </p>
            </div>
            <div className="pokemon-stats-section">
              <h3>Base Stats:</h3>
              {pokemon.stats.map((stat, i) => (
                <div key={i} className="stat-row">
                  <span className="stat-name">{stat.name}</span>
                  <div className="stat-bar-background">
                    <div
                      className="stat-bar-fill"
                      style={{
                        background: stat.value >= 100 ? "#4caf50" : "#f39c12",
                        width: `${(stat.value / 255) * 255}px`,
                      }}
                    />
                  </div>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
              <p>
                <strong>Total Stats:</strong> {pokemon.totalStats}
              </p>
            </div>
          </div>

          {forms.length > 0 && (
            <div>
              <h3>Forms:</h3>
              <div className="forms-container">
                {forms.map((form, index) => (
                  <div
                    key={index}
                    className="form-item"
                    onClick={() =>
                      fetchPokemon(form.name.toLowerCase().replace(/\s+/g, "-"))
                    }
                  >
                    <h4>{form.name}</h4>
                    <img src={form.sprite} alt={form.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Enter a Pokémon name to see its details.</p>
      )}
    </div>
  );
}

export default PokemonInfo;

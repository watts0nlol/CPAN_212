import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function formatName(name) {
  return name
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

function PokemonInfo() {
  const { name } = useParams();
  const [pokemonName, setPokemonName] = useState(name || "");
  const [pokemon, setPokemon] = useState(null);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");

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
      if (!response.ok) {
        throw new Error("Pokémon not found!");
      }
      const data = await response.json();

      setPokemon({
        name: formatName(data.name),
        sprite: data.sprites.front_default,
        abilities: data.abilities
          .map((a) => formatName(a.ability.name))
          .join(", "),
        types: data.types.map((t) => formatName(t.type.name)).join(", "),
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

  return (
    <div>
      <nav>
        <ul>
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
      <h1>Pokémon</h1>
      <input
        type="text"
        placeholder="Enter Pokémon Name"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
      />
      <button onClick={() => fetchPokemon(pokemonName)}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pokemon ? (
        <div>
          <h2>Name: {pokemon.name}</h2>
          <img src={pokemon.sprite} alt={pokemon.name} />
          <p>Types: {pokemon.types}</p>
          <p>Abilities: {pokemon.abilities}</p>

          {forms.length > 0 && (
            <div>
              <h3>Forms:</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {forms.map((form, index) => (
                  <div
                    key={index}
                    style={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => fetchPokemon(form.name.toLowerCase())}
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

import { useEffect, useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/pikachu") // Fetch Pikachu data to test if it works
      .then((response) => response.json())
      .then((data) => {
        setPokemon({
          name: data.name,
          abilities: data.abilities.map((a) => a.ability.name), // Extract ability names
        });
      })
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  return (
    <div>
      <h1>Pokémon API Test</h1>
      {pokemon ? (
        <div>
          <h2>Name: {pokemon.name}</h2>
          <h3>Abilities:</h3>
          <ul>
            {pokemon.abilities.map((ability) => (
              <li key={ability}>{ability}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
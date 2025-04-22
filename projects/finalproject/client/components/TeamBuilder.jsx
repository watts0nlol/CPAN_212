import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/PokemonApp.css";

function formatName(name) {
  const formMap = [
    { pattern: /-mega(-[xy])?$/, label: "Mega" },
    { pattern: /-gmax$/, label: "Gigantamax" },
    { pattern: /-alola$/, label: "Alolan" },
    { pattern: /-galar$/, label: "Galarian" },
    { pattern: /-hisui$/, label: "Hisuian" },
    { pattern: /-paldea$/, label: "Paldean" },
    { pattern: /-10$/, label: "10%" },
    { pattern: /-complete$/, label: "Complete" },
    { pattern: /-attack$/, label: "Attack" },
    { pattern: /-defense$/, label: "Defense" },
    { pattern: /-speed$/, label: "Speed" },
    { pattern: /-origin$/, label: "Origin" },
    { pattern: /-sky$/, label: "Sky" },
    { pattern: /-therian$/, label: "Therian" },
    { pattern: /-resolute$/, label: "Resolute" },
    { pattern: /-blade$/, label: "Blade" },
    { pattern: /-rapid-strike$/, label: "Rapid Strike" },
    { pattern: /-single-strike$/, label: "Single Strike" },
  ];

  for (const { pattern, label } of formMap) {
    if (pattern.test(name)) {
      const base = name.replace(pattern, "").replace(/-/g, " ");
      return `${capitalizeWords(base)} (${label})`;
    }
  }

  return capitalizeWords(name.replace(/[-_]/g, " "));
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

const TeamBuilder = () => {
  const [team, setTeam] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [savedTeams, setSavedTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);

  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem("pokemonTeam"));
    const savedName = localStorage.getItem("teamName");
    if (savedTeam) setTeam(savedTeam);
    if (savedName) setTeamName(savedName);
    fetchSavedTeams();
    fetchAllPokemonForms();
  }, []);

  useEffect(() => {
    localStorage.setItem("pokemonTeam", JSON.stringify(team));
    localStorage.setItem("teamName", teamName);
  }, [team, teamName]);

  const fetchSavedTeams = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/get-teams");
      if (!response.ok) throw new Error("Failed to fetch teams.");
      const data = await response.json();
      setSavedTeams(data);
    } catch (error) {
      console.error("Error fetching saved teams:", error);
    }
  };

  const fetchAllPokemonForms = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
      const data = await res.json();
      const names = data.results.map((p) => p.name);
      setAllPokemon(names);
    } catch (err) {
      console.error("Failed to fetch all Pokémon forms:", err);
    }
  };

  const handlePokemonInput = (value) => {
    setPokemonName(value);
    if (value.length === 0) {
      setFilteredSuggestions([]);
      return;
    }
    const filtered = allPokemon.filter((p) =>
      p.toLowerCase().startsWith(value.toLowerCase().replace(/\s+/g, "-"))
    );
    setFilteredSuggestions(filtered.slice(0, 10));
  };

  const selectSuggestion = (name) => {
    setPokemonName(formatName(name));
    setFilteredSuggestions([]);
  };

  const getSpeciesName = async (pokemonName) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.species.name; // e.g., "urshifu" for all Urshifu forms
    } catch {
      return null;
    }
  };
  
  const addPokemon = async () => {
    if (team.length >= 6) {
      setError("Your team is full! (Max 6 Pokémon)");
      return;
    }
    setError("");
  
    const rawName = allPokemon.find((p) => formatName(p) === pokemonName);
    if (!rawName) {
      setError("Pokémon not found. Please check the name.");
      return;
    }
  
    const normalizedName = rawName.toLowerCase();
    const newSpecies = await getSpeciesName(normalizedName);
  
    if (!newSpecies) {
      setError("Could not determine Pokémon species.");
      return;
    }
  
    // Get species names for all Pokémon currently in the team
    const teamSpeciesList = await Promise.all(
      team.map((poke) => getSpeciesName(poke.name.toLowerCase()))
    );
  
    const duplicate = teamSpeciesList.includes(newSpecies);
    if (duplicate) {
      setError(`${formatName(rawName)} or a form of it is already in your team!`);
      return;
    }
  
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${rawName}`);
      if (!response.ok) {
        setError("Pokémon not found. Please check the name.");
        return;
      }
  
      const data = await response.json();
      const abilities = data.abilities.map((a) => a.ability.name);
  
      const newPokemon = {
        name: formatName(data.name),
        sprite:
          data.sprites.front_default ||
          data.sprites.other?.["official-artwork"]?.front_default ||
          "",
        types: data.types.map((t) => formatName(t.type.name)).join(", "),
        moves: data.moves.map((m) => m.move.name).sort(),
        abilities,
        selectedMoves: Array(4).fill(""),
        selectedAbility: abilities[0] || "",
      };
  
      setTeam([...team, newPokemon]);
      setPokemonName("");
      setFilteredSuggestions([]);
    } catch {
      setError("Error fetching Pokémon.");
    }
  };
  

  const removePokemon = (index) => {
    const updatedTeam = team.filter((_, i) => i !== index);
    setTeam(updatedTeam);
  };

  const updatePokemon = (index, key, value) => {
    const updatedTeam = [...team];
    updatedTeam[index][key] = value;
    setTeam(updatedTeam);
  };

  const getNextUntitledName = () => {
    const untitledNumbers = savedTeams
      .filter((t) => t.teamname?.startsWith("Untitled"))
      .map((t) => parseInt(t.teamname.replace("Untitled ", ""), 10))
      .filter((n) => !isNaN(n));
    let i = 1;
    while (untitledNumbers.includes(i)) i++;
    return `Untitled ${i}`;
  };

  const generateTeamNameFromPokemon = () => {
    return team.length > 0
      ? team.map((p) => p.name).join(" | ")
      : getNextUntitledName();
  };

  const saveTeamToDatabase = async () => {
    const name = teamName.trim() || generateTeamNameFromPokemon();
    const updatedTeam = team.map((poke) => ({
      name: poke.name,
      sprite: poke.sprite,
      types: poke.types,
      selectedAbility: poke.selectedAbility || poke.abilities[0] || "",
      selectedMoves: poke.selectedMoves.filter((m) => m),
    }));

    try {
      const response = await fetch("http://localhost:8001/api/save-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: updatedTeam, teamname: name }),
      });
      if (!response.ok) throw new Error("Failed to save team.");
      const result = await response.json();
      alert(result.message || "Team saved successfully!");
      setTeamName("");
      fetchSavedTeams();
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Error saving team. Please try again.");
    }
  };

  const deleteTeam = async (id) => {
    try {
      await fetch(`http://localhost:8001/api/delete-team/${id}`, {
        method: "DELETE",
      });
      setSavedTeams(savedTeams.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const editTeam = async (teamObj) => {
    setEditingTeam(teamObj);
    setTeamName(teamObj.teamname || "");

    const formattedTeam = await Promise.all(
      teamObj.team.map(async (poke) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${poke.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          );
          const data = await response.json();
          const abilities = data.abilities.map((a) => a.ability.name);
          const moves = data.moves.map((m) => m.move.name).sort();
          const types = data.types
            .map((t) => formatName(t.type.name))
            .join(", ");

          return {
            name: poke.name || "Unknown",
            sprite: poke.sprite || "",
            types,
            abilities,
            selectedAbility: poke.selectedAbility || abilities[0] || "Unknown",
            moves,
            selectedMoves: Array.isArray(poke.selectedMoves)
              ? [
                  ...poke.selectedMoves,
                  ...Array(4 - poke.selectedMoves.length).fill(""),
                ]
              : Array(4).fill(""),
          };
        } catch (error) {
          console.error(`Failed to fetch data for ${poke.name}`, error);
          return {
            name: poke.name || "Unknown",
            sprite: poke.sprite || "",
            types: poke.types || "Unknown",
            abilities: poke.abilities || [poke.selectedAbility || "Unknown"],
            selectedAbility:
              poke.selectedAbility || poke.abilities?.[0] || "Unknown",
            moves: poke.moves || [],
            selectedMoves: Array.isArray(poke.selectedMoves)
              ? [
                  ...poke.selectedMoves,
                  ...Array(4 - poke.selectedMoves.length).fill(""),
                ]
              : Array(4).fill(""),
          };
        }
      })
    );

    setTeam(formattedTeam);
  };

  const updateTeamInDatabase = async () => {
    if (!editingTeam) return;
    const name = teamName.trim() || generateTeamNameFromPokemon();

    const updatedTeam = team.map((poke) => ({
      name: poke.name,
      sprite: poke.sprite,
      types: poke.types,
      selectedAbility: poke.selectedAbility,
      selectedMoves: poke.selectedMoves,
    }));

    try {
      const response = await fetch(
        `http://localhost:8001/api/update-team/${editingTeam._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            team: updatedTeam,
            teamname: name,
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert("Team updated successfully!");
      setEditingTeam(null);
      setTeam([]);
      setTeamName("");
      fetchSavedTeams();
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Error updating team. Please try again.");
    }
  };

  return (
    <div className="team-builder">
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
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      <h2>Pokémon Team Builder</h2>

      <div className="autosuggest-input">
        <input
          type="text"
          placeholder="Enter Pokémon Name"
          value={pokemonName}
          onChange={(e) => handlePokemonInput(e.target.value)}
        />
        {filteredSuggestions.length > 0 && (
          <ul className="suggestion-box">
            {filteredSuggestions.map((name, i) => (
              <li key={i} onClick={() => selectSuggestion(name)}>
                {formatName(name)}
              </li>
            ))}
          </ul>
        )}
        <button onClick={addPokemon}>Add Pokémon</button>
        <button onClick={() => setTeam([])}>Clear Team</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="team-list">
        {team.map((poke, index) => (
          <li key={index} className="pokemon-card">
            <div className="pokemon-header">
              <img
                src={poke.sprite}
                alt={poke.name}
                className="pokemon-sprite"
              />
              <Link
                to={`/pokemon/${poke.name.toLowerCase()}`}
                className="info-button"
              >
                ℹ️
              </Link>
            </div>
            <h3>{poke.name}</h3>
            <p>Type: {poke.types}</p>
            <label>Ability:</label>
            <select
              value={poke.selectedAbility || poke.abilities[0] || ""}
              onChange={(e) =>
                updatePokemon(index, "selectedAbility", e.target.value)
              }
            >
              {poke.abilities.map((ability, i) => (
                <option key={i} value={ability}>
                  {formatName(ability)}
                </option>
              ))}
            </select>
            {[...Array(4)].map((_, moveIndex) => (
              <div key={moveIndex}>
                <label>Move {moveIndex + 1}:</label>
                <input
                  type="text"
                  list={`moves-list-${index}-${moveIndex}`}
                  value={formatName(poke.selectedMoves[moveIndex])}
                  onChange={(e) => {
                    const formattedMove = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-");
                    const currentMoves = poke.selectedMoves;

                    if (formattedMove && currentMoves.includes(formattedMove)) {
                      alert("This move is already selected!");
                      return;
                    }

                    const newMoves = [...currentMoves];
                    newMoves[moveIndex] = formattedMove;
                    updatePokemon(index, "selectedMoves", newMoves);
                  }}
                />
                <datalist id={`moves-list-${index}-${moveIndex}`}>
                  {poke.moves.map((move, i) => (
                    <option key={i} value={formatName(move)} />
                  ))}
                </datalist>
              </div>
            ))}
            <button onClick={() => removePokemon(index)}>Remove</button>
          </li>
        ))}
      </ul>

      {editingTeam ? (
        <button onClick={updateTeamInDatabase}>Update Team</button>
      ) : (
        <button onClick={saveTeamToDatabase}>Save Team</button>
      )}

      <h2>Saved Teams</h2>
      <ul className="saved-teams">
        {savedTeams.map((team) => (
          <li key={team._id} className="saved-team">
            <h3>
              {team.teamname ||
                (team.team && team.team.length > 0
                  ? team.team.map((p) => p.name).join(" | ")
                  : "Untitled Team")}
            </h3>
            <div className="team-display">
              {team.team.map((poke, i) => (
                <div key={i} className="saved-pokemon">
                  <img src={poke.sprite} alt={poke.name} />
                  <p>{poke.name}</p>
                  <p>Type: {poke.types}</p>
                  <p>
                    Ability:{" "}
                    {formatName(
                      poke.selectedAbility || poke.abilities?.[0] || "None"
                    )}
                  </p>
                  <p>Moves: {poke.selectedMoves?.map(formatName).join(", ")}</p>
                </div>
              ))}
            </div>
            <button onClick={() => editTeam(team)}>Edit</button>
            <button onClick={() => deleteTeam(team._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamBuilder;

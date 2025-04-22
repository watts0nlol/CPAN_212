import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/PokemonApp.css";

const typeEffectivenessMap = {};

const preloadTypeEffectiveness = async () => {
  if (Object.keys(typeEffectivenessMap).length > 0) return typeEffectivenessMap;

  const res = await fetch("https://pokeapi.co/api/v2/type");
  const data = await res.json();
  const types = data.results.filter(
    (type) => type.name !== "shadow" && type.name !== "unknown"
  );

  const promises = types.map(async (type) => {
    const res = await fetch(type.url);
    const data = await res.json();
    typeEffectivenessMap[type.name] = data.damage_relations;
  });

  await Promise.all(promises);
  return typeEffectivenessMap;
};

const getEffectiveness = (atkType, defType) => {
  const relations = typeEffectivenessMap[atkType];
  if (!relations) return 1;

  if (relations.double_damage_to.some((t) => t.name === defType)) return 2;
  if (relations.half_damage_to.some((t) => t.name === defType)) return 0.5;
  if (relations.no_damage_to.some((t) => t.name === defType)) return 0;

  return 1;
};

const Types = () => {
  const [types, setTypes] = useState([]);
  const [primaryType, setPrimaryType] = useState("");
  const [secondaryType, setSecondaryType] = useState("");
  const [isDualType, setIsDualType] = useState(false);
  const [typeRelations, setTypeRelations] = useState(null);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [monotypeOnly, setMonotypeOnly] = useState(false);
  const navigate = useNavigate();

  // Initial fetch for types and effectiveness map
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      const filtered = data.results.filter(
        (type) => type.name !== "shadow" && type.name !== "unknown"
      );
      setTypes(filtered.map((t) => t.name));

      await preloadTypeEffectiveness(); // Cache typeEffectivenessMap
    };
    fetchData();
  }, []);

  // Fetch all Pokémon with types and sprites
  useEffect(() => {
    const fetchAllPokemon = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
      const data = await res.json();

      const detailedData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: details.name,
            types: details.types.map((t) => t.type.name),
            sprite: details.sprites.front_default,
          };
        })
      );

      setAllPokemon(detailedData);
    };

    fetchAllPokemon();
  }, []);

  // Update type relations
  useEffect(() => {
    if (!primaryType) return;

    const fetchRelations = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${primaryType}`);
      const data = await res.json();
      let combined = { ...data.damage_relations };

      if (secondaryType) {
        const res2 = await fetch(
          `https://pokeapi.co/api/v2/type/${secondaryType}`
        );
        const data2 = await res2.json();

        const mergeTypeArrays = (a1, a2) => {
          const all = [...a1, ...a2];
          return all.filter(
            (item, index) =>
              all.findIndex((i) => i.name === item.name) === index
          );
        };

        combined = {
          double_damage_to: mergeTypeArrays(
            data.damage_relations.double_damage_to,
            data2.damage_relations.double_damage_to
          ),
          half_damage_to: mergeTypeArrays(
            data.damage_relations.half_damage_to,
            data2.damage_relations.half_damage_to
          ),
          no_damage_to: mergeTypeArrays(
            data.damage_relations.no_damage_to,
            data2.damage_relations.no_damage_to
          ),
          double_damage_from: mergeTypeArrays(
            data.damage_relations.double_damage_from,
            data2.damage_relations.double_damage_from
          ),
          half_damage_from: mergeTypeArrays(
            data.damage_relations.half_damage_from,
            data2.damage_relations.half_damage_from
          ),
          no_damage_from: mergeTypeArrays(
            data.damage_relations.no_damage_from,
            data2.damage_relations.no_damage_from
          ),
        };
      }

      setTypeRelations(combined);
    };

    fetchRelations();
  }, [primaryType, secondaryType]);

  // Filter Pokémon by selected types
  useEffect(() => {
    if (!primaryType) {
      setFilteredPokemon([]);
      return;
    }

    const matches = allPokemon.filter((p) => {
        if (isDualType) {
          return (
            p.types.length === 2 &&
            p.types.includes(primaryType) &&
            p.types.includes(secondaryType)
          );
        } else if (monotypeOnly) {
          return p.types.length === 1 && p.types[0] === primaryType;
        } else {
          return p.types.includes(primaryType);
        }
      });
      

    setFilteredPokemon(matches);
  }, [primaryType, secondaryType, isDualType, allPokemon, monotypeOnly]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const renderTypeBox = (types, label, colorClass) => (
    <div>
      <h3>{label}</h3>
      {types.length === 0 ? (
        <p>None</p>
      ) : (
        <div className="type-box-row">
          {types.map((type) => (
            <span key={type.name} className={`type-box ${colorClass}`}>
              {capitalize(type.name)}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={"pokemon-info"}>
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

      <h1>Type Effectiveness</h1>

      <div className="selector">
        <label>
          Primary Type:
          <select
            value={primaryType}
            onChange={(e) => setPrimaryType(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Select --</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {capitalize(type)}
              </option>
            ))}
          </select>
        </label>

        <label className="dual-type-toggle">
          <input
            type="checkbox"
            checked={isDualType}
            onChange={(e) => setIsDualType(e.target.checked)}
          />
          Enable Dual Type
        </label>

        {isDualType && (
          <label>
            Secondary Type:
            <select
              value={secondaryType}
              onChange={(e) => setSecondaryType(e.target.value)}
              className="dropdown"
            >
              <option value="">-- Select --</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {capitalize(type)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <label className="monotype-toggle">
        <input
          type="checkbox"
          checked={monotypeOnly}
          onChange={(e) => setMonotypeOnly(e.target.checked)}
          disabled={isDualType}
        />
        Monotype Only
      </label>

      <h1 className="highlighted-type">
        {capitalize(primaryType)} {capitalize(secondaryType)}
      </h1>

      {typeRelations && (
        <div className="relations">
          <div>
            <h2>Offensive</h2>
            {renderTypeBox(
              typeRelations.double_damage_to,
              "Super Effective (2x)",
              "super"
            )}
            {renderTypeBox(
              typeRelations.half_damage_to,
              "Not Very Effective (0.5x)",
              "resist"
            )}
            {renderTypeBox(
              typeRelations.no_damage_to,
              "No Effect (0x)",
              "immune"
            )}
          </div>
          <div>
            <h2>Defensive</h2>
            {renderTypeBox(
              typeRelations.double_damage_from,
              "Weak To (2x)",
              "super"
            )}
            {renderTypeBox(
              typeRelations.half_damage_from,
              "Resists (0.5x)",
              "resist"
            )}
            {renderTypeBox(
              typeRelations.no_damage_from,
              "Immune To (0x)",
              "immune"
            )}
          </div>
        </div>
      )}

      <div className="type-chart">
        <h2>Type Chart</h2>
        <table>
          <thead>
            <tr>
              <th>Attack ↓ / Defense →</th>
              {types.map((defType) => (
                <th key={defType}>{capitalize(defType)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((atkType) => (
              <tr key={atkType}>
                <td>{capitalize(atkType)}</td>
                {types.map((defType) => {
                  const multiplier = getEffectiveness(atkType, defType);
                  let className = "";
                  if (multiplier === 2) className = "super";
                  else if (multiplier === 0.5) className = "resist";
                  else if (multiplier === 0) className = "immune";

                  return (
                    <td key={defType} className={className}>
                      {multiplier}x
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="blurb">
          <strong>Note:</strong> Stellar is only super effective against
          Terastallized Pokémon.
        </p>
      </div>

      <div className="matching-pokemon">
        <h2>Matching Pokémon</h2>
        <ul>
          {filteredPokemon.map((pokemon, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => navigate(`/pokemon/${pokemon.name.toLowerCase()}`)}
            >
              <p>{capitalize(pokemon.name)}</p>
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
    </div>
  );
};

export default Types;

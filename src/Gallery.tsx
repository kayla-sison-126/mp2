import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface PokemonRef {
  name: string;
  url: string;
}

interface TypePokemonResponse {
  pokemon: {
    pokemon: PokemonRef;
  }[];
}

interface ApiListResponse {
  results: PokemonRef[];
}


const POKEMON_TYPES = [ // all pokemon types!
  "Normal", "Grass", "Water", "Fire", "Electric", "Ice",
  "Fighting", "Poison", "Ground", "Rock", "Ghost", "Dragon",
  "Dark", "Steel", "Fairy", "Flying", "Psychic", "Bug", "All"
];

// Helper to extract ID from URL string for sprites
const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export default function Gallery() {
  const [pokemonList, setPokemonList] = useState<PokemonRef[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedType === "All") {
          const response = await axios.get<ApiListResponse>(
            "https://pokeapi.co/api/v2/pokemon?limit=151" //just kanto again
          );
          setPokemonList(response.data.results);
        } else {
          // fetches pokemon by type
          const typeName = selectedType.toLowerCase();
          const response = await axios.get<TypePokemonResponse>(
            `https://pokeapi.co/api/v2/type/${typeName}`
          );

          const extractedList = response.data.pokemon
            .map((item) => item.pokemon)
            .filter((p) => getPokemonIdFromUrl(p.url) <= 151);

          setPokemonList(extractedList);
        }
      } catch (err) {
        console.error("Error fetching gallery Pokémon:", err);
        setError("Failed to load gallery data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [selectedType]);

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1>Pokedex Gallery</h1>
        <p>Discover all Pokemon and filter by type</p>
      </header>

      <div className="type-buttons-container">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            className={`type-btn ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <div className="loading-state">Loading gallery...</div>}
      {error && <div className="error-state">{error}</div>}

      {!loading && !error && (
        <div className="gallery-grid">
          {pokemonList.map((pokemon) => {
            const id = getPokemonIdFromUrl(pokemon.url);
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            return (
              <Link
                key={pokemon.name}
                to={`/pokemon/${id}`}
                className="gallery-card-link"
              >
                <div className="gallery-card">
                  <div className="gallery-img-container">
                    <img src={spriteUrl} alt={pokemon.name} loading="lazy" />
                  </div>
                  <div className="gallery-card-footer">
                    <span>
                      {pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
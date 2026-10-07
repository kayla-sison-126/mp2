import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentId = parseInt(id || "1", 10);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);

        const detailRes = await axios.get<PokemonDetail>(
          `https://pokeapi.co/api/v2/pokemon/${currentId}`,
        );

        const speciesRes = await axios.get<PokemonSpecies>(
          `https://pokeapi.co/api/v2/pokemon-species/${currentId}`,
        );

        setPokemon(detailRes.data);

        const englishEntry = speciesRes.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en",
        );

        const cleanDescription = englishEntry
          ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
          : "No description available.";

        setDescription(cleanDescription);
      } catch (err) {
        console.error("Error fetching detail view:", err);
        setError("Failed to load Pokémon details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [currentId]);

  const handlePrev = () => {
    //arrow left
    if (currentId > 1) {
      navigate(`/pokemon/${currentId - 1}`);
    }
  };

  const handleNext = () => {
    //arrow right
    if (currentId < 151) {
      navigate(`/pokemon/${currentId + 1}`);
    }
  };

  if (loading) return <div>Loading details...</div>;
  if (error || !pokemon) return <div>{error || "Pokemon not found"}</div>;

  return (
    <div className="detail-container">
      <div className="detail-card-wrapper">
        <div className="detail-card">
          {/* Top Prev / Next Navigation Arrows */}
          <div className="detail-nav-buttons">
            <button
              className="detail-arrow-btn"
              onClick={handlePrev}
              disabled={currentId <= 1}
            >
              &#8592;
            </button>
            <button
              className="detail-arrow-btn"
              onClick={handleNext}
              disabled={currentId >= 151}
            >
              &#8594;
            </button>
          </div>

          {/* Main Content */}
          <div className="detail-body">
            <div className="detail-img-container">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>

            <div className="detail-info">
              <h2>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h2>
              <p>Pokedex #: {pokemon.id}</p>
              <p>Type: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
              <p>
                Height: {pokemon.height}dm &nbsp; Weight: {pokemon.weight}hg
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-description">
            <h3>Description:</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

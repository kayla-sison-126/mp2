import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export interface DetailResource {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonCardProps {
  name: string;
  url: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ name, url }) => {
  const [details, setDetails] = useState<DetailResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DetailResource>(url);
        setDetails(response.data);
      } catch (err) {
        console.error(`Error fetching details for ${name}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [url, name]);

  if (loading) return <div>Loading {name}...</div>;
  if (error || !details) return <div>Failed to load {name}</div>;

  return (
    <Link to={`/pokemon/${details.id}`} className="card-link">
      <div className="pokemon-card">
        <div className="pokemon-img-container">
          <img src={details.sprites.front_default} alt={details.name} />
        </div>
        <div className="pokemon-info">
          <h2>
            {details.name.charAt(0).toUpperCase() + details.name.slice(1)}
          </h2>
          <p>Pokedex #: {details.id}</p>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
import { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NamedResource {
  name: string;
  url: string;
}

const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export default function Search() {
  const [dataList, setDataList] = useState<NamedResource[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiListResponse<NamedResource>>(
          "https://pokeapi.co/api/v2/pokemon?limit=151", // limit to just kanto pokemon
        );
        setDataList(response.data.results);
      } catch (err) {
        console.error("Error fetching Pokémon list:", err);
        setError("Failed to load Pokémon list.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPokemon = dataList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = getPokemonIdFromUrl(a.url) - getPokemonIdFromUrl(b.url);
    }

    return sortOrder === "asc" ? comparison : -comparison; // handle ascending/descending
  });

  if (loading) return <div className="loading-state">Loading Pokémon...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="search-container">
      <header className="search-header">
        <h1>Pokédex Search</h1>
        <p>Look up a Pokémon and discover its basic information</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-group">
          <select
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "id" | "name")}
          >
            <option value="id">Sort by Pokédex #</option>
            <option value="name">Sort by Name (A-Z)</option>
          </select>

          <div className="radio-btns">
            <label className="radio-label">
              <input
                type="radio"
                name="sortOrder"
                value="asc"
                checked={sortOrder === "asc"}
                onChange={() => setSortOrder("asc")}
              />
              Asc
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="sortOrder"
                value="desc"
                checked={sortOrder === "desc"}
                onChange={() => setSortOrder("desc")}
              />
              Desc
            </label>
          </div>
        </div>
      </div>

      <div className="card-list-container">
        {sortedPokemon.length > 0 ? (
          sortedPokemon.map((item) => (
            <PokemonCard key={item.name} name={item.name} url={item.url} />
          ))
        ) : (
          <p className="no-results">No Pokémon found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
}

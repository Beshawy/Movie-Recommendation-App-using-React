import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import SelectGenre from "../components/SelectGenre";
import NotAvailable from "../components/NotAvailable";
import { getGenres, fetchMovies, fetchDataByGenre } from "../store";

function MoviePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { movies, genres, genresLoaded } = useSelector(
    (state) => state.netflix
  );

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "movie" }));
    }
  }, [genresLoaded, dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handleGenreChange = (genreId) => {
    if (genreId !== "All") {
      dispatch(fetchDataByGenre({ genre: genreId, type: "movie" }));
      const genreName = genres.find(g => g.id === parseInt(genreId))?.name;
      setSelectedGenre(genreName || "All");
    } else {
      dispatch(fetchMovies({ type: "movie" }));
      setSelectedGenre("All");
    }
  };

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>

      <div className="hero">
        <h1>Welcome to Movie Paradise</h1>
        <p>Discover your next favorite movie</p>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <SelectGenre 
          genres={genres} 
          type="movie"
          onChange={(e) => handleGenreChange(e.target.value)}
        />
      </div>

      <div className="content">
        {filteredMovies.length > 0 ? (
          selectedGenre === "All" && searchTerm === "" ? (
            <Slider movies={movies} />
          ) : (
            <div className="filtered-results">
              <h2>
                {searchTerm
                  ? `Search Results for "${searchTerm}"`
                  : `${selectedGenre} Movies`}
              </h2>
              <div className="movies-grid">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.image}`}
                      alt={movie.name}
                    />
                    <h3>{movie.name}</h3>
                    <span>{movie.genres.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <NotAvailable />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: white;
  .navbar {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .hero {
    padding: 5rem 2rem 2rem;
    text-align: center;
    background: linear-gradient(180deg, #000000, #1a1a1a);
  }

  .hero h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .hero p {
    font-size: 1.2rem;
    color: #bbb;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background-color: #111;
  }

  .search-box input {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    width: 250px;
    font-size: 1rem;
  }

  .content {
    padding: 2rem;
  }

  .filtered-results h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }

  .movie-card {
    background-color: #1e1e1e;
    padding: 1rem;
    border-radius: 8px;
    transition: transform 0.2s ease-in-out;
  }

  .movie-card:hover {
    transform: scale(1.05);
  }

  .movie-card img {
    width: 100%;
    height: 270px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .movie-card h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .movie-card span {
    font-size: 0.9rem;
    color: #aaa;
  }
`;

export default MoviePage;

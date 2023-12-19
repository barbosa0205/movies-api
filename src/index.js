import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
import crypto from "node:crypto";
import movies from "./movies.json" assert { type: "json" };
import { validateMovie, validatePartialMovie } from "./schemas/movies.js";

const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   /* options */
// });

app.use(express.json());

app.get("/", (req, res) => {
  res
    .json({
      "Hello from": "API",
    })
    .status(200);
});
//FETCH ALL MOVIES
app.get("/movies", (req, res) => {
  const { genre } = req.query;
  //FILTER BY GENRE
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  return res.json(movies);
});

//FETCH MOVIE BY ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  return res.status(404).json({
    message: "Movie not found",
  });
});

//CREATE NEW MOVIE
app.post("/movies", (req, res) => {
  const { title, year, duration, director, poster, genre, rate } = req.body;

  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message),
    });
  }

  const newMovie = {
    id: crypto.randomUUID(), //uuid v4
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

// UPDATE MOVIE BY ID
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (!result.success)
    return res.status(400).json({ message: JSON.parse(result.error.message) });

  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(400).json({
      message: "Movie not found",
    });
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

//DELETE MOVIE BY ID
app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1)
    return res.status(404).json({
      message: "Movie not found",
    });
  movies.splice(movieIndex, 1);
  return res.status(204).json();
});

// PORT
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Running on port ", port);
});

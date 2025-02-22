const express = require('express')
const crypto = require('node:crypto') // Módulo nativo de Node.js para generar hashes o ids únicos
const movies = require('./movies.json')

const app = express()
app.use(express.json()) // Middleware para parsear el body de las peticiones
app.disable('x-powered-by') // Ocultar la cabecera de express

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies) // Devuelve todas las películas si no se proporciona un género
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ error: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  console.log('Request body:', req.body) // Log para depurar el cuerpo de la petición
  const {
    title,
    genre,
    year,
    director,
    duration,
    rate,
    poster
  } = req.body

  if (!title || !genre || !year || !director || !duration || !poster) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newMovie = {
    id: crypto.randomUUID(), // Generar un id único uuid v4
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 5,
    poster
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})

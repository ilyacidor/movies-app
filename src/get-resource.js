const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODkyODBiZmUzMmFhNzA1OWIyOTRmYjI4NGQ1NzUxNSIsInN1YiI6IjY0OGVjMTFjYzNjODkxMDBhZTUxNGRlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ki5F-ehfFdjCPANWJjADp2Fjf8ytMXuOxiZC4bf-wxk',
  },
}

export default class GetResource {
  getMovies = async (page, q) => {
    if (!q) q = 't'
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=%20${q}&include_adult=false&page=${page}`,
      options
    )
    if (!res.ok) {
      throw new Error(`Could not get movies, received ${res.status}`)
    }
    return await res.json()
  }

  getGenres = async () => {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }
    return await res.json()
  }

  debounce(fn, debounceTime) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, debounceTime)
    }
  }

  debounceGetMovies = this.debounce(this.getMovies, 500)
}

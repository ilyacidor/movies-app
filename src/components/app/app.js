import React, { Component } from 'react'
import { format } from 'date-fns'
import { Spin, Alert, Pagination, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'

import SearchBar from '../search-bar'
import ItemList from '../item-list'
import GetResource from '../../get-resource'
import GenreContext from '../../genre-context'
import './app.css'

export default class App extends Component {
  state = {
    movieData: [],
    genresData: [],
    loading: true,
    error: false,
    activeKey: '1',
    currentPage: 1,
    totalResults: 0,
    query: '',
  }

  getResource = new GetResource()

  componentDidMount() {
    this.loadGenres()
  }

  componentDidUpdate(prevState) {
    if (
      (this.state.currentPage !== prevState.currentPage ||
        this.state.query !== prevState.query ||
        this.state.activeKey !== prevState.activeKey) &&
      this.state.movieData.length === 0
    ) {
      this.updateMovieData()
    }
  }

  componentDidCatch() {
    this.setState({ error: true })
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

  shortTitle = (title) => {
    if (title.length > 26) {
      let str = title.slice(0, 26)
      let k = 25
      while (str[k] !== ' ') {
        str = str.slice(0, k)
        k--
      }
      title = str + ' ...'
    }
    return title
  }

  shotText = (text, title) => {
    if (title.length > 13) {
      if (text.length > 160) {
        let str = text.slice(0, 160)
        let k = 159
        while (str[k] !== ' ') {
          str = str.slice(0, k)
          k--
        }
        text = str + ' ...'
      }
    } else {
      if (text.length > 200) {
        let str = text.slice(0, 200)
        let k = 199
        while (str[k] !== ' ') {
          str = str.slice(0, k)
          k--
        }
        text = str + ' ...'
      }
    }
    return text
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  loadGenres() {
    this.getResource.getGenres().then((obj) => {
      obj.genres.forEach((genre) => {
        this.setState(({ genresData }) => {
          const newItem = {
            genreId: genre.id,
            genreName: genre.name,
          }
          const newArray = [...genresData, newItem]
          return {
            genresData: newArray,
          }
        })
      })
    })
  }

  updateMovieData = () => {
    this.getResource
      .getMovies(this.state.currentPage, this.state.query)
      .then((movies) => {
        if (this.state.activeKey == 1) {
          this.setState({ totalResults: movies.total_results })
        } else {
          this.setState({ totalResults: localStorage.length })
        }
        movies.results.forEach((movie) => {
          this.setState(
            ({ movieData }) => {
              let imgPath = 'https://movienewsletters.net/photos/000000h1.jpg'
              if (movie.poster_path !== null) imgPath = 'https://image.tmdb.org/t/p/original' + movie.poster_path
              let date = 'release date unknown'
              if (movie.release_date.length === 10) date = format(new Date(movie.release_date), 'MMMM dd, yyyy')
              let rate = 0
              if (localStorage.getItem(movie.id) !== null || localStorage.getItem(movie.id) > 0)
                rate = Number(localStorage.getItem(movie.id))
              const newItem = {
                id: movie.id,
                posterPath: imgPath,
                title: this.shortTitle(movie.title),
                voteAverage: Math.round(Number(movie.vote_average) * 10) / 10,
                releaseDate: date,
                genreIds: movie.genre_ids,
                overview: this.shotText(movie.overview, movie.title),
                userRate: rate,
              }
              const newArray = [...movieData, newItem]
              return {
                movieData: newArray,
              }
            },
            () => {}
          )
        })
        this.setState({ loading: false })
      })
      .catch(this.onError)
  }

  updateQuery = (q) => {
    this.setState({ currentPage: 1, query: q, movieData: [], loading: true })
  }

  updatePage = (page) => {
    this.setState({ currentPage: page, movieData: [], loading: true })
  }

  changeTab = (key) => {
    this.setState({ activeKey: key, currentPage: 1, query: '', movieData: [], loading: true })
  }

  filterRatedMovies = () => {
    const { movieData, activeKey } = this.state
    if (activeKey == 2) {
      return movieData.filter(({ userRate }) => userRate > 0)
    }
    return movieData
  }

  render() {
    const { movieData, genresData, loading, error, currentPage, totalResults, query, activeKey } = this.state
    const items = [
      {
        key: '1',
        label: 'Search',
      },
      {
        key: '2',
        label: 'Rated',
      },
    ]
    const errorMessage = error ? (
      <Alert
        message="Boom!"
        description="Something has gone terribly wrong! (But we are already trying to fix it)"
        type="error"
      />
    ) : null
    if (error) return errorMessage
    const spin = loading ? (
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    ) : null
    const notFound =
      movieData.length === 0 && !(loading || error) ? (
        <Alert message="Oops!" description="Movies Not Found" type="info" />
      ) : null
    const content = !(loading || error) ? (
      <div>
        {notFound}
        <GenreContext.Provider value={genresData}>
          <ItemList movies={this.filterRatedMovies()} />
        </GenreContext.Provider>
        <Pagination
          current={currentPage}
          total={totalResults}
          pageSize={20}
          pageSizeOptions={[20]}
          onChange={this.updatePage}
        />
      </div>
    ) : null

    return (
      <div className="container">
        <Online>
          <Tabs defaultActiveKey="1" centered items={items} onChange={this.changeTab} destroyInactiveTabPane="true" />
          <SearchBar updateMovieList={this.updateQuery} query={query} activeKey={activeKey} />
          {spin}
          {content}
          {errorMessage}
        </Online>
        <Offline>
          <Alert message="No connection!" description="Please check your internet connection!" type="error" />
        </Offline>
      </div>
    )
  }
}

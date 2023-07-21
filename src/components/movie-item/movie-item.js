import React, { useContext } from 'react'
import { Rate } from 'antd'

import GenreContext from '../../genre-context'
import GenreItem from '../genre-item'
import './movie-item.css'

const MovieItem = ({ id, posterPath, title, releaseDate, overview, userRate, genreIds, voteAverage }) => {
  const changeRating = (value) => {
    localStorage.setItem(id, value)
  }
  let genres = useContext(GenreContext)
  if (genreIds.length > 2) {
    genreIds = genreIds.slice(0, 2)
  }
  let arr = []
  genres.forEach((element) => {
    genreIds.forEach((el) => {
      if (element.genreId == el) arr.push(element)
    })
  })
  const elements = arr.map((item) => {
    const { ...itemProps } = item
    const { genreId } = itemProps
    return <GenreItem key={genreId} {...itemProps} />
  })
  let voteClass = 'vote-average vote-average--'
  let color = ''
  color = voteAverage < 3 ? 'red' : voteAverage < 5 ? 'orange' : voteAverage < 7 ? 'yellow' : 'green'
  voteClass += color
  voteAverage = String(voteAverage).length < 2 ? (voteAverage += '.0') : voteAverage
  return (
    <li className="movies-list__item" key={id}>
      <div className="poster-container">
        <img src={posterPath} alt="poster" className="poster"></img>
      </div>
      <section className="movie">
        <h2 className="movie__title">{title}</h2>
        <p className="movie__date">{releaseDate}</p>
        <div className="movie__genres">{elements}</div>
        <p className="movie__overview">{overview}</p>
        <Rate allowHalf defaultValue={userRate} count={10} className="user-rate" onChange={changeRating} />
      </section>
      <span className={voteClass}>{voteAverage}</span>
    </li>
  )
}

export default MovieItem

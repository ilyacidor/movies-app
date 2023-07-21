import React, { Component } from 'react'

import MovieItem from '../movie-item'
import './item-list.css'

export default class ItemList extends Component {
  render() {
    const movies = this.props.movies
    const elements = movies.map((item) => {
      const { ...itemProps } = item
      const { id } = itemProps
      return <MovieItem key={id} {...itemProps} />
    })
    return (
      <ul className="movies-list" key={this.props.id}>
        {elements}
      </ul>
    )
  }
}

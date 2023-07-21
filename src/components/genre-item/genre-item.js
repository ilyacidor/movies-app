import React, { Component } from 'react'

import './genre-item.css'

export default class GenreItem extends Component {
  render() {
    const { genreName } = this.props
    return <span className="movie__genre">{genreName}</span>
  }
}

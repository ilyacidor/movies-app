import React, { Component } from 'react'
import './search-bar.css'

export default class SearchBar extends Component {
  onSubmit = (e) => {
    e.preventDefault()
  }

  onLabelChange = (e) => {
    if (e.target.value.charAt(0) === ' ') {
      e.target.value = ''
    }
    if (e.target.value.length) {
      this.props.updateMovieList(e.target.value)
    }
  }

  render() {
    const { query, activeKey } = this.props
    const formContent =
      activeKey == '1' ? (
        <form className="search" onSubmit={this.onSubmit}>
          <input
            className="search__input"
            name="search"
            placeholder="Type to search..."
            onChange={this.onLabelChange}
            defaultValue={query}
          />
        </form>
      ) : null
    return <div>{formContent}</div>
  }
}

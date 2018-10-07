import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="venue-filter">
        <div className="input-container">
          <label htmlFor="search-filter">Search</label>
          <input
            type="text"
            id="search-filter"
            placeholder="Search for location"
            value={this.props.query}
            onChange={event => this.props.filterVenues(event.target.value)}
          />
        </div>
        <div className="list-container">
          <ul>
            {this.props.visibleVenues.map(el => (
              <li>☕ {el.venue.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

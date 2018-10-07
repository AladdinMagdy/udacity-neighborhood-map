import React, { Component } from "react";
import "./App.css";

class VenuesList extends Component {
  render() {
    return (
      <section
        className="venue-filter"
        style={{
          display: `${this.props.menu === "open" ? "block" : "none"}`
        }}
      >
        <div className="footer">
          <p>Data displayed from FourSquare Api</p>
        </div>
        <div className="input-container">
          <label htmlFor="search-filter">Search</label>
          <input
            type="text"
            id="search-filter"
            aria-label="Search"
            placeholder="Search for location"
            value={this.props.query}
            onChange={event => this.props.filterVenues(event.target.value)}
          />
        </div>
        <div className="list-container">
          {this.props.error ? (
            <p
              style={{
                background: "#000",
                color: "#fff"
              }}
            >
              Sorry, we can't fetch your data at the moment
            </p>
          ) : (
            <ul>
              {this.props.visibleVenues.map((el, i) => (
                <li
                  onClick={e => this.props.ListItemClick(e)}
                  name={el.venue.name}
                  role="location"
                  key={i}
                  tabIndex={i}
                >
                  ☕ {el.venue.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }
}

export default VenuesList;

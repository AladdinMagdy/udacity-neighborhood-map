import React, { Component } from "react";
import "./App.css";
import VenuesList from "./VenuesList";
import escapeRegExp from "escape-string-regexp";

class App extends Component {
  state = {
    venues: [],
    visibleVenues: [],
    query: "",
    menu: "closed"
  };

  componentDidMount() {
    this.getVenues();
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  // The first function to be called after map loads.. this function is to fetch data from foursquare
  getVenues = () => {
    fetch(
      "https://api.foursquare.com/v2/venues/explore?client_id=FNIB25PW25FZ1SM44ZSXRZ53BI30SBM2X3E5OXQ1DRKT3GBZ&client_secret=HLEGTIU4QCAW0N45AKJUQHGKF3LQK4YPB1Z1F0MTHAYXD2SP&v=20180323&near=Chicago&query=coffee"
    )
      .then(response => response.json())
      .then(myJson => {
        this.setState(
          {
            venues: myJson.response.groups[0].items,
            visibleVenues: myJson.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(err => {
        console.log("error: " + err);
        this.setState({
          err
        });
      });
  };

  // the initMap function required for google map api to work
  initMap = () => {
    //make map
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.881832, lng: -87.623177 },
      zoom: 11
    });

    //make info PopUp
    var infowindow = new window.google.maps.InfoWindow();

    // Add marker for every venue on map
    this.state.venues.forEach(myVenue => {
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map,
        title: myVenue.venue.name
      });

      //stick an event listner to that marker
      marker.addListener("click", () => {
        infowindow.setContent(
          `<div>${myVenue.venue.name}<br/>${
            myVenue.venue.location.address
          }<br/>${myVenue.venue.categories[0].name}</div>`
        );
        infowindow.open(map, marker);
      });

      myVenue.marker = marker;
      myVenue.display = true;

      this.setState({
        venue: myVenue,
        infowindow
      });
    });
  };

  // this function workes when user types in search
  filterVenues = q => {
    //close any open info popups
    this.state.infowindow.close();

    const match = new RegExp(escapeRegExp(q), "i");
    this.state.venues.forEach(el => {
      if (match.test(el.venue.name)) {
        el.marker.setVisible(true);
      } else {
        el.marker.setVisible(false);
      }
    });
    this.setState({
      query: q,
      visibleVenues: [
        ...this.state.venues.filter(el => match.test(el.venue.name))
      ]
    });
  };

  // function to handle clicking on list items
  ListItemClick = e => {
    this.state.infowindow.close();
    const selected = this.state.visibleVenues.filter(
      el => el.venue.name === e.target.attributes.name.value
    )[0];
    this.state.infowindow.setContent(
      `<div>${selected.venue.name}<br/>${selected.venue.location.address}<br/>${
        selected.venue.categories[0].name
      }</div>`
    );
    this.state.infowindow.open(selected.marker.map, selected.marker);
  };

  handleMenuClick = () => {
    this.setState({
      menu: this.state.menu === "open" ? "closed" : "open"
    });
  };

  render() {
    return (
      <div className="app">
        <VenuesList
          menu={this.state.menu}
          filterVenues={this.filterVenues}
          query={this.state.query}
          visibleVenues={this.state.visibleVenues}
          ListItemClick={e => this.ListItemClick(e)}
          error={this.state.err}
        />
        <div className="map-container">
          <a onClick={this.handleMenuClick} className="burger-menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z" />
            </svg>
          </a>
          <div id="map" />
        </div>
      </div>
    );
  }
}
window.errorHandler = () => {
  alert("Seems like you are using an invalid api key");
};
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
  script.onerror = window.errorHandler;
}

export default App;

import React, { Component } from "react";
import "./App.css";
import VenuesList from "./VenuesList";
import escapeRegExp from "escape-string-regexp";

class App extends Component {
  state = {
    venues: [],
    visibleVenues: [],
    query: ""
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

  getVenues = () => {
    const self = this;
    fetch(
      "https://api.foursquare.com/v2/venues/explore?client_id=FNIB25PW25FZ1SM44ZSXRZ53BI30SBM2X3E5OXQ1DRKT3GBZ&client_secret=HLEGTIU4QCAW0N45AKJUQHGKF3LQK4YPB1Z1F0MTHAYXD2SP&v=20180323&near=Chicago&query=coffee"
    )
      .then(response => response.json())
      .then(myJson => {
        console.log(myJson);
        self.setState(
          {
            venues: myJson.response.groups[0].items,
            visibleVenues: myJson.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(err => {
        console.log("error: " + err);
      });
  };

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.881832, lng: -87.623177 },
      zoom: 11
    });

    var infowindow = new window.google.maps.InfoWindow();

    const loc = [];
    this.state.venues.forEach(myVenue => {
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map,
        title: myVenue.venue.name
      });

      marker.addListener("click", () => {
        infowindow.setContent(`${myVenue.venue.name}`);
        infowindow.open(map, marker);
      });

      myVenue.marker = marker;
      myVenue.display = true;
      loc.push(myVenue);

      this.setState({
        venue: myVenue
      });
    });
  };

  filterVenues = q => {
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

  render() {
    return (
      <div className="app">
        <div id="map" />
        <VenuesList
          filterVenues={this.filterVenues}
          query={this.state.query}
          visibleVenues={this.state.visibleVenues}
        />
      </div>
    );
  }
}
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
  script.onerror = () => {
    document.write("Can't load Google Maps");
  };
}

export default App;

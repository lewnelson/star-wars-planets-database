"use strict";

import { Search } from "./Search.js";
import { Table } from "./Table.js";
const Swapi = require("../lib/Swapi.js");

export class Planets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      loading: true,
      result: {},
      sortKey: "",
      direction: 0
    };

    this.inputHandler = this.inputHandler.bind(this);
    this.getSearchValue = this.getSearchValue.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.getSortDirection = this.getSortDirection.bind(this);
    this.toggleSortDirection = this.toggleSortDirection.bind(this);
    this.sortData = this.sortData.bind(this);
    this.requestInProgress = {};
  }

  getSortDirection(key) {
    let direction = 0;
    if(key === this.state.sortKey) {
      direction = this.state.direction;
    }

    return direction;
  }

  toggleSortDirection(key) {
    let direction;
    if(key === this.state.sortKey) {
      direction = this.state.direction === 1 ? -1 : 1;
      this.state.direction = direction;
    } else {
      this.state.direction = 1;
    }
  }

  sortData(key) {
    this.toggleSortDirection(key);
    let data = this.state.result.results || [];
    let direction = this.getSortDirection(key);

    data.sort((a, b) => {
      let valA = a[key],
          valB = b[key];

      if(valA.match(/^[\d]+$/) !== null || valB.match(/^[\d]+$/) !== null) {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      }

      if(direction >= 0) {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    let result = this.state.result;
    result.results = data;
    this.setState({result: result, sortKey: key});
  }

  /**
   *  
   */
  loadResult(uri, searchValue) {
    if(typeof this.requestInProgress.cancel === "function") {
      this.requestInProgress.cancel();
    }

    if(uri === undefined) {
      uri = "/planets/";
      if(searchValue !== undefined) {
        uri += "?search=" + searchValue;
      }
    }

    this.setState({loading: true});
    this.requestInProgress = Swapi.get(uri);
    this.requestInProgress.then((result) => {
      this.setState({result: result, loading: false, sortKey: "", direction: 0});
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false, result: {}, sortKey: "", direction: 0});
    });
  }

  componentDidMount() {
    this.loadResult();
  }

  inputHandler(event) {
    this.setState({
      searchValue: event.target.value
    });

    this.loadResult(undefined, event.target.value);
  }

  getSearchValue() {
    return this.state.searchValue;
  }

  clearSearchValue() {
    this.setState({
      searchValue: ""
    });
  }

  getFields() {
    return [
      {
        key: "name",
        label: "Name",
        sortable: true
      },
      {
        key: "population",
        label: "Population",
        sortable: true
      },
      {
        key: "diameter",
        label: "Diameter (km)",
        sortable: true
      },
      {
        key: "rotation_period",
        label: "Rotation Period (hours)",
        sortable: true
      },
      {
        key: "orbital_period",
        label: "Orbital Period (days)",
        sortable: true
      },
      {
        key: "terrain",
        label: "Terrains",
        value: (v) => v.split(",").map((s) => s.trim())
      },
      {
        key: "films",
        label: "Films",
        value: (v) => {
          return new Promise((resolve, reject) => {
            let promises = v.map((uri) => Swapi.get(uri));
            Promise.all(promises).then((results) => {
              resolve(results.map((r) => r.title));
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          });
        }
      }
    ];
  }

  render() {
    let data = this.state.result.results || [],
        componentClasses = [
          "planets-component"
        ];

    if(this.state.loading === true) {
      componentClasses.push("loading");
    }

    return (
      <div className={componentClasses.join(" ")}>
        <Search
          inputHandler={this.inputHandler}
          searchValue={this.state.searchValue}
          clearSearchValue={this.clearSearchValue} />

        <Table
          data={data}
          getSortDirection={this.getSortDirection}
          sortData={this.sortData}
          sortKey={this.state.sortKey}
          fields={this.getFields()} />
      </div>
    );
  }
}
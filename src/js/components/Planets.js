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
    };

    this.inputHandler = this.inputHandler.bind(this);
    this.getSearchValue = this.getSearchValue.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.requestInProgress = {};
  }

  loadResult(uri) {
    if(typeof this.requestInProgress.cancel === "function") {
      this.requestInProgress.cancel();
    }

    if(uri === undefined) {
      uri = "/planets/";
      if(this.state.searchValue !== "") {
        uri += "?search=" + this.state.searchValue;
      }
    }

    this.setState({loading: true});
    this.requestInProgress = Swapi.get(uri);
    this.requestInProgress.then((result) => {
      this.setState({result: result, loading: false});
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false, result: {}});
    });
  }

  componentDidMount() {
    this.loadResult();
  }

  inputHandler(event) {
    this.setState({
      searchValue: event.target.value
    });
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
        label: "Name"
      },
      {
        key: "population",
        label: "Population"
      },
      {
        key: "diameter",
        label: "Diameter (km)"
      },
      {
        key: "rotation_period",
        label: "Rotation Period (hours)"
      },
      {
        key: "orbital_period",
        label: "Orbital Period (days)"
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
          return new ES6Promise((resolve, reject) => {
            let promises = v.map((uri) => Swapi.get(uri));
            ES6Promise.all(promises).then((results) => {
              resolve(results.map((r) => r.title));
            }).catch((err) => {
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
          fields={this.getFields()} />
      </div>
    );
  }
}
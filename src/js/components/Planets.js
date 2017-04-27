"use strict";

import { Search } from "./Search.js";
import { Table } from "./Table.js";
const Swapi = require("../lib/Swapi.js");

/**
 *  Planets component to display and search for Star Wars planets. Renders Search
 *  component, Table component and Pagination component.
 */
export class Planets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      loading: true,
      result: {},
      error: false
    };

    this.searchInputHandler = this.searchInputHandler.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.requestInProgress = {};
  }

  /**
   *  Load the result from the api with an optional search value
   *
   *  @param {string} searchValue
   *  @return {void}
   */
  loadResult(searchValue) {
    let uri = "/planets/";
    if(typeof this.requestInProgress.cancel === "function") {
      this.requestInProgress.cancel();
    }

    if(searchValue !== undefined) {
      uri += "?search=" + searchValue;
    }

    this.setState({loading: true});
    this.requestInProgress = Swapi.get(uri);
    this.requestInProgress.then((result) => {
      this.setState({result: result, loading: false, error: false});
    }).catch((err) => {
      this.setState({result: {}, loading: false, error: true});
    });
  }

  /**
   *  Once the component has mounted load in the data
   *
   *  @return {void}
   */
  componentDidMount() {
    this.loadResult();
  }

  /**
   *  Handle the search input from an input element onChange event. Will update
   *  search in state and load results with search term.
   *
   *  @param {Event} event
   *  @return {void}
   */
  searchInputHandler(event) {
    this.setState({
      searchValue: event.target.value
    });

    this.loadResult(event.target.value);
  }

  /**
   *  Clear the search value, will update search value state and load result with
   *  no search term
   *
   *  @return {void}
   */
  clearSearchValue() {
    this.setState({
      searchValue: ""
    });

    this.loadResult();
  }

  /**
   *  Get list of field objects to display in the data table
   *
   *  @return {array} Array of field objects
   */
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

  /**
   *  Will check if error state exists and either load in data table or display
   *  error.
   */
  render() {
    let data = this.state.result.results || [],
        componentClasses = [
          "planets-component"
        ];

    if(this.state.loading === true) {
      componentClasses.push("loading");
    }

    let dataComponent;
    if(this.state.error === true) {
      dataComponent = <div className="data-error">Error loading data</div>
    } else {
      dataComponent = <Table
        loading={this.state.loading}
        data={data}
        fields={this.getFields()} />;
    }

    return (
      <div className={componentClasses.join(" ")}>
        <Search
          inputHandler={this.searchInputHandler}
          searchValue={this.state.searchValue}
          clearSearchValue={this.clearSearchValue} />

        {dataComponent}
      </div>
    );
  }
}
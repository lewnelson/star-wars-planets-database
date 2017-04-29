"use strict";

import { Search } from "./Search.js";
import { Table } from "./table/Table.js";
import { Pagination } from "./Pagination.js";
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
      error: false,
      page: 1
    };

    this.searchInputHandler = this.searchInputHandler.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.requestInProgress = {};
  }

  /**
   *  Load the result from the api with an optional search value
   *
   *  @param {string} searchValue
   *  @param {int} page
   *  @return {void}
   */
  loadResult(searchValue, page) {
    let uri = "/planets/",
        queryParams = {};

    if(typeof this.requestInProgress.cancel === "function") {
      this.requestInProgress.cancel();
    }

    if(searchValue !== undefined && searchValue !== "") {
      queryParams.search = searchValue;
    } else if(searchValue === undefined && this.state.searchValue !== "") {
      queryParams.search = this.state.searchValue;
    }

    if(page !== undefined) {
      queryParams.page = page;
    } else if(page === undefined && this.state.page !== undefined) {
      queryParams.page = this.state.page;
    }

    let compiledQueryParams = Object.keys(queryParams).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(queryParams[k]));
    uri = compiledQueryParams.length > 0 ? uri + "?" + compiledQueryParams.join("&") : uri;

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
   *  When the state is updated the result should be reloader. Result should
   *  only be loaded when page or search value has changed
   *
   *  @param {object} prevProps
   *  @param {object} prevState
   *  @return {void}
   */
  componentDidUpdate(prevProps, prevState) {
    if(prevState.searchValue !== this.state.searchValue || prevState.page !== this.state.page) {
      this.loadResult();
    }
  }

  /**
   *  Load results for a specific page number
   *
   *  @param {int} pageNumber
   *  @return {void}
   */
  goToPage(pageNumber) {
    this.setState({
      page: pageNumber
    });
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
      searchValue: event.target.value,
      page: 1
    });
  }

  /**
   *  Clear the search value, will update search value state and load result with
   *  no search term
   *
   *  @return {void}
   */
  clearSearchValue() {
    this.setState({
      searchValue: "",
      page: 1
    });
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
              reject(err);
            });
          });
        }
      }
    ];
  }

  /**
   *  Gets the amount of pages for the result
   *
   *  @return {int}
   */
  getTotalPages() {
    let count = this.state.result.count || 0;
    return count > 0 ? Math.ceil(count / 10) : 1;
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

        <Pagination
          goToPage={this.goToPage}
          totalPages={this.getTotalPages()}
          currentPage={this.state.page} />
      </div>
    );
  }
}
"use strict";

import { TableHead } from "./TableHead.js";
import { TableBody } from "./TableBody.js";

/**
 *  Table component, renders all sub table components. Accepts the following props
 *   - fields : {array} Array of field objects, each field object can have the
 *                      following keys
 *                      - key {string} Key to use on data
 *                      - label {string} The field label
 *                      - value (optional) {function} To resolve value from data takes plain
 *                                                    value as argument. Should return promise,
 *                                                    string or array. Promise should resolve to
 *                                                    a string or array.
 *                      
 *                      - sortable (optional) {boolean} Defaults to false, is the data sortable
 *                                                      by this field.
 *
 *   - data : {array} Array of data objects that contain the keys defined in fields
 *   - loading : {boolean} Is data currently loading?
 */
export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sorting: {}
    };

    this.setSorting = this.setSorting.bind(this);
    this.sortData = this.sortData.bind(this);
  }

  /**
   *  Updates the sorting state so that data will be re-sorted. Direction will
   *  loop through 1, -1 and 0 where they mean ascending, descending and default
   *  respectively.
   *
   *  @param {string} key Key to sort on
   *  @param {function} done (optional) When state has been set
   *  @return {void}
   */
  setSorting(key, done) {
    let sorting = this.state.sorting,
        direction = 1;

    done = done || function(){};
    if(sorting.key === key) {
      direction = sorting.direction === 1 ? -1 : sorting.direction === -1 ? 0 : 1;
    }

    this.setState({
      sorting: {
        key: key,
        direction: direction
      }
    }, done);
  }

  /**
   *  Sorts the props data and returns the sorted data. Gets the data required
   *  for sorting from state and props. Sorting is case insensitive. Will convert
   *  numerical strings to integers before sorting.
   *
   *  @return {array}
   */
  sortData() {
    let data = this.props.data || [],
        sorting = this.state.sorting;

    // Ensure data is not assigned by reference
    data = data.slice(0);

    // Check if the data needs to be sorted
    if(sorting.key !== undefined && sorting.direction !== 0) {
      data.sort((a, b) => {
        let valA = String(a[sorting.key]).toLowerCase(),
            valB = String(b[sorting.key]).toLowerCase();

        // Convert string values to integers when string only contains numbers
        if(valA.match(/^[\d]+$/) !== null || valB.match(/^[\d]+$/) !== null) {
          valA = parseInt(valA) || 0;
          valB = parseInt(valB) || 0;
        }

        if(sorting.direction === 1) {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
    }

    return data;
  }

  render() {
    let data = this.sortData();
    return (
      <div className="table-wrapper">
        <div className="table">
          <TableHead
            fields={this.props.fields}
            setSorting={this.setSorting}
            sorting={this.state.sorting} />

          <TableBody
            data={data}
            fields={this.props.fields}
            loading={this.props.loading} />
        </div>
      </div>
    );
  }
}
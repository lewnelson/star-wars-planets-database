"use strict";

import { Loader } from "./Loader.js";

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
   *  @return {void}
   */
  setSorting(key) {
    let sorting = this.state.sorting,
        direction = 1;

    if(sorting.key === key) {
      direction = sorting.direction === 1 ? -1 : sorting.direction === -1 ? 0 : 1;
    }

    this.setState({
      sorting: {
        key: key,
        direction: direction
      }
    });
  }

  /**
   *  Sorts the props data and returns the sorted data. Gets the data required
   *  for sorting from state and props. Sorting direction is 
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
        let valA = a[sorting.key],
            valB = b[sorting.key];

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

/**
 *  Table head component will render out a thead element containing a row with
 *  all th cells from the prop fields.
 *
 *  Accepts the following props:
 *   - fields {array} See Table component for full description
 *   - setSorting {function} Function that accepts single argument `key` which
 *                           will set the key to sort data on. The sorting
 *                           direction loops through three states, ascending,
 *                           descending or default.
 *
 *   - sorting {object} Contains two optional keys, `key` and `direction` where
 *                      direction can be 1 for ascending, -1 for descending and
 *                      0 for default.
 */
class TableHead extends React.Component {
  /**
   *  Gets a list of all th elements by looping through each field from the fields
   *  prop.
   *
   *  @return {array of TableHeadCell} Gets array of TableHeadCell components
   */
  getThElements() {
    let fields = this.props.fields.slice(0),
        thElems = [];

    while(fields.length > 0) {
      let field = fields.shift();
      thElems.push(
        <TableHeadCell
          key={field.key}
          setSorting={this.props.setSorting}
          sorting={this.props.sorting}
          field={field} />
      );
    }

    return thElems;
  }

  render() {
    return (
      <div className="table-head">
        <div className="table-row">
          {this.getThElements()}
        </div>
      </div>
    );
  }
}

/**
 *  Table head cell component will render th elements. The table head elements
 *  can affect sorting of data if available on the field.
 *
 *  Accepts following props:
 *   - setSorting : {function} Function accepting single `key` argument to set
 *                             sorting for that key.
 *
 *   - sorting : {object} Contains following keys, `key` and `direction`. See
 *                        TableHead component description for more info.
 *
 *   - field : {object} Field object from the list of fields passed to Table
 */
class TableHeadCell extends React.Component {
  constructor(props) {
    super(props);
    this.setSorting = this.setSorting.bind(this);
  }

  /**
   *  Will only set sorting using props if the field is sortable
   *
   *  @return {void}
   */
  setSorting() {
    if(this.props.field.sortable !== true) {
      return;
    }

    this.props.setSorting(this.props.field.key);
  }

  render() {
    let classes = ["cell", this.props.field.key],
        sortDirection = this.props.sorting.direction || 0;
        
    if(sortDirection > 0 && this.props.sorting.key === this.props.field.key) {
      classes.push("sort-ascending");
    } else if(sortDirection < 0 && this.props.sorting.key === this.props.field.key) {
      classes.push("sort-descending");
    }

    if(this.props.field.sortable === true) {
      classes.push("sortable");
    }

    return (
      <div
        className={classes.join(" ")}
        onClick={this.setSorting}>
        {this.props.field.label}
      </div>
    );
  }
}

/**
 *  Table body component will render tbody element with rows of TableRow
 *  components.
 *
 *  It accepts a `data` prop, a `fields` prop and a `loading` prop. See Table
 *  component description for more info.
 */
class TableBody extends React.Component {
  /**
   *  Fetch the HTML to display an empty result set
   *
   *  @return {HTML component}
   */
  getEmptyResult() {
    return <div className="table-empty-data">No results to display</div>
  }

  /**
   *  Parses each data object into a TableRow component
   *
   *  @return {array of TableRow} Returns array of TableRow components
   */
  getDataRows() {
    let rows = [],
        data = this.props.data || [];

    data = data.slice(0);
    for(let i = 0; i < data.length; i++) {
      rows.push(<TableRow data={data[i]} fields={this.props.fields} key={data[i].url} />);
    }

    return rows.length > 0 ? rows : this.getEmptyResult();
  }

  render() {
    return (
      <div className="table-body">
        <Loader loading={this.props.loading} />
        {this.getDataRows()}
      </div>
    );
  }
}

/**
 *  Renders a tr element with all td components inside corresponding with the
 *  fields.
 *
 *  Accepts `fields` prop and `data` prop where data is single data object.
 */
class TableRow extends React.Component {
  /**
   *  Gets all TableDataCell components for the data object
   *
   *  @return {array of TableDataCell} Array of TableDataCell components
   */
  getDataCells() {
    let fields = this.props.fields.slice(0),
        dataCells = [];

    while(fields.length > 0) {
      let field = fields.shift(),
          value = this.props.data[field.key] || null;

      dataCells.push(
        <TableDataCell
          field={field}
          value={value}
          key={field.key} />
      )
    }

    return dataCells;
  }

  render() {
    return (
      <div className="table-row">
        {this.getDataCells()}
      </div>
    );
  };
}

/**
 *  Renders the td cell from field object and value.
 *
 *  Accepts following props
 *   - field : {object} Single field object
 *   - value : {string|array} Optional, will resolve to `N/A` when not defined
 */
class TableDataCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loading: false
    };
  }

  /**
   *  As the value can be resolved via a function which returns a promise, the
   *  initial value may not be the value that should be displayed. The value needs
   *  to be resolved as soon as the component is mounted
   *
   *  @return {void}
   */
  componentDidMount() {
    this.resolveValue();
  }

  /**
   *  If the component is about to unmount and a promise exists which is resolving
   *  the value then the promise should be cancelled to prevent it's callbacks
   *  from being triggered as the component will no longer exist.
   *
   *  @return {void}
   */
  componentWillUnmount() {
    if(this.promise !== undefined) {
      this.promise.cancel();
    }
  }

  /**
   *  Resolves the value from either the value that is passed or if the field
   *  has a key `value` which is a function via the callback from the field.
   *
   *  @return {void}
   */
  resolveValue() {
    let value = this.props.value;
    switch(true) {
      case value === null:
      case value === undefined:
        this.setState({value: "N/A"});
        break;

      case (typeof this.props.field.value === "function"):
        let resolvedValue = this.props.field.value(value);
        if((resolvedValue instanceof Promise)) {
          this.promise = resolvedValue;
          this.setState({loading: true});
          this.promise.then((v) => this.setState({value: v, loading: false})).catch((err) => this.setState({value: "ERR", loading: false}));
        } else if(typeof resolvedValue !== undefined) {
          this.setState({value: resolvedValue});
        } else {
          this.setState({value: "N/A"});
        }
        break;

      default:
        this.setState({value: value});
        break;
    }
  }

  /**
   *  Gets the values as HTML, if the value is an array then each array element
   *  gets it's own span element. If the value is a string it is converted to
   *  an array and then renders as an array.
   *
   *  @return {array} Array of HTML components
   */
  getValues() {
    let value = (this.state.value instanceof Array) ? this.state.value : [this.state.value],
        values = [];

    for(let i = 0; i < value.length; i++) {
      values.push(<span key={i}>{value[i]}</span>)
    }

    return values;
  }

  render() {
    let classes = ["cell", this.props.field.key];
    if(this.state.loading === true) {
      classes.push("loading");
    }

    return (
      <div className={classes.join(" ")}>
        <Loader loading={this.state.loading} />
        {this.getValues()}
      </div>
    );
  }
}
"use strict";

import { Loader } from "../Loader.js";
import { TableRow } from "./TableRow.js";

/**
 *  Table body component will render tbody element with rows of TableRow
 *  components.
 *
 *  It accepts a `data` prop, a `fields` prop and a `loading` prop. See Table
 *  component description for more info.
 */
export class TableBody extends React.Component {
  /**
   *  Fetch the HTML to display an empty result set
   *
   *  @return {HTML component}
   */
  getEmptyResult() {
    return <div className="table-empty-data">No results to display</div>
  }

  /**
   *  Generates unique key string based on fields and data
   *
   *  @param {object} data
   *  @return {string}
   */
  getUniqueKey(data) {
    return JSON.stringify({
      fields: this.props.fields,
      data: data
    });
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
      rows.push(<TableRow data={data[i]} fields={this.props.fields} key={this.getUniqueKey(data[i])} />);
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
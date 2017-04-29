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
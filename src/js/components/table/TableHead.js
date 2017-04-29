"use strict";

import { TableHeadCell } from "./TableHeadCell.js";

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
export class TableHead extends React.Component {
  /**
   *  Gets a list of all th elements by looping through each field from the fields
   *  prop.
   *
   *  @return {array of TableHeadCell} Gets array of TableHeadCell components
   */
  getThElements() {
    let fields = this.props.fields instanceof Array ? this.props.fields.slice(0) : [],
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
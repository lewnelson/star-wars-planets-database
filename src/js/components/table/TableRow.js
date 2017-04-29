"use strict";

import { TableDataCell } from "./TableDataCell.js";

/**
 *  Renders a tr element with all td components inside corresponding with the
 *  fields.
 *
 *  Accepts `fields` prop and `data` prop where data is single data object.
 */
export class TableRow extends React.Component {
  /**
   *  Gets all TableDataCell components for the data object
   *
   *  @return {array of TableDataCell} Array of TableDataCell components
   */
  getDataCells() {
    let fields = this.props.fields instanceof Array ? this.props.fields.slice(0) : [],
        dataCells = [],
        data = this.props.data !== undefined ? this.props.data : {};

    while(fields.length > 0) {
      let field = fields.shift(),
          value = data[field.key] || null;

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
"use strict";

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
export class TableHeadCell extends React.Component {
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
        sorting = this.props.sorting !== undefined ? this.props.sorting : {},
        sortDirection = sorting.direction || 0;
        
    if(sortDirection > 0 && sorting.key === this.props.field.key) {
      classes.push("sort-ascending");
    } else if(sortDirection < 0 && sorting.key === this.props.field.key) {
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
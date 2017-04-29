"use strict";

/**
 *  Renders pagination, accepts the following props:
 *   - totalPages : {int} The total number of available pages, integer greater
 *                        than 0
 *                        
 *   - currentPage : {int} To be greater than 0 and less than or equal to totalPages
 *                         
 *   - goToPage : {function} Function that accepts single argument of page number
 *                           will then go to that page number
 */
export class Pagination extends React.Component {
  constructor(props) {
    super(props);

    if(this.props.currentPage === undefined || this.props.totalPages === undefined) {
      throw new Error("props.currentPage and props.totalPages must be defined");
    } else if(this.props.currentPage < 1 || this.props.currentPage > this.props.totalPages) {
      throw new Error("Invalid value specified for props.currentPage, should be greater than 0 and less than or equal to props.totalPages");
    }

    this.goToPage = this.goToPage.bind(this);
    this.getFirst = this.getFirst.bind(this);
    this.getPreviousArrow = this.getPreviousArrow.bind(this);
    this.getPageNumbers = this.getPageNumbers.bind(this);
    this.getNextArrow = this.getNextArrow.bind(this);
    this.getLast = this.getLast.bind(this);
  }

  /**
   *  Call goToPage on props if the selected page is not the current page, is
   *  greater than or equal to 1 and is less than or equal to the total number
   *  of pages.
   *
   *  @param {int} pageNumber
   *  @return {void}
   */
  goToPage(pageNumber) {
    if(pageNumber !== this.props.currentPage && pageNumber <= this.props.totalPages && pageNumber >= 1) {
      this.props.goToPage(pageNumber);
    }
  }

  /**
   *  Get `first` pagination element
   *
   *  @return {HTML component}
   */
  getFirst() {
    let classes = ["first"];
    if(this.props.currentPage === 1) {
      classes.push("disabled");
    }

    return <span
      className={classes.join(" ")}
      onClick={() => this.goToPage(1)}>
        First
      </span>;
  }

  /**
   *  Get previous page arrow
   *
   *  @return {HTML component}
   */
  getPreviousArrow() {
    let classes = ["previous"],
        entity = "\u25c0";

    if(this.props.currentPage === 1) {
      classes.push("disabled");
    }

    return <span
      className={classes.join(" ")}
      onClick={() => this.goToPage(this.props.currentPage - 1)}>{entity}</span>;
  }

  /**
   *  Renders page numbers, will render a maximum of 2 page numbers and ellipsis
   *  for forwards and backwards navigation
   *
   *  @return {array} Array of HTML components
   */
  getPageNumbers() {
    // Initialise page numbers array with current page
    let pageNumbers = [
          {
            label: this.props.currentPage,
            value: this.props.currentPage
          }
        ],
        output = [];

    if(this.props.currentPage < this.props.totalPages) {
      // Add next page
      pageNumbers.push({
        label: this.props.currentPage + 1,
        value: this.props.currentPage + 1
      });

      // Add ellipsis for next
      if(this.props.currentPage + 1 <= this.props.totalPages) {
        pageNumbers.push({
          label: "...",
          value: this.props.currentPage + 2
        });
      }

      // Add ellipsis for previous
      if(this.props.currentPage - 1 >= 1) {
        pageNumbers.unshift({
          label: "...",
          value: this.props.currentPage - 1
        });
      }
    } else if(this.props.currentPage > 1) {
      // Add previous page
      pageNumbers.unshift({
        label: this.props.currentPage - 1,
        value: this.props.currentPage - 1
      });

      // Add ellipsis for previous
      if(this.props.currentPage - 2 >= 1) {
        pageNumbers.unshift({
          label: "...",
          value: this.props.currentPage - 2
        });
      }
    }

    while(pageNumbers.length > 0) {
      let next = pageNumbers.shift(),
          classes = ["page-number"];

      if(next.value === this.props.currentPage) {
        classes.push("active");
      }

      output.push(
        <span
          className={classes.join(" ")}
          key={"page-number-" + next.value}
          value={next.value}
          onClick={() => this.goToPage(next.value)}>
            {next.label}
        </span>
      );
    }

    return output;
  }

  /**
   *  Get next page arrow
   *
   *  @return {HTML component}
   */
  getNextArrow() {
    let classes = ["next"],
        entity = "\u25ba";

    if(this.props.currentPage === this.props.totalPages) {
      classes.push("disabled");
    }

    return <span
      className={classes.join(" ")}
      onClick={() => this.goToPage(this.props.currentPage + 1)}>{entity}</span>;
  }

  /**
   *  Get `last` pagination element
   *
   *  @return {HTML component}
   */
  getLast() {
    let classes = ["last"];
    if(this.props.currentPage === this.props.totalPages) {
      classes.push("disabled");
    }

    return <span
      className={classes.join(" ")}
      onClick={() => this.goToPage(this.props.totalPages)}>
        Last
      </span>;
  }

  render() {
    return (
      <div className="pagination-component">
        {this.getFirst()}
        {this.getPreviousArrow()}
        {this.getPageNumbers()}
        {this.getNextArrow()}
        {this.getLast()}
      </div>
    );
  }
}
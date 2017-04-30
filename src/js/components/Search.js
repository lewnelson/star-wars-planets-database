"use strict";

/**
 *  Search bar component, accepts the following props:
 *   - searchValue : {string} (optional) The search value to display in the search
 *                            input
 *
 *   - inputHandler : {function} Event handler callback for search input onChange
 *   - clearSearchValue : {function} Event handler for when search should be cleared
 */
export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  /**
   *  Trigger focus onto the search input element. When the input is cleared focus
   *  is lost.
   *
   *  @return {void}
   */
  focus() {
    this.searchInput.focus();
  }

  /**
   *  Handles the clear search event, will trigger the prop clear search callback
   *  and then refocus on the search input.
   *
   *  @param {Event} e
   *  @return {void}
   */
  clearSearch(e) {
    this.props.clearSearchValue(e);
    this.focus();
  }

  render() {
    let clearIconClasses = [
      "icon"
    ];

    if(this.props.searchValue === "" || this.props.searchValue === undefined) {
      clearIconClasses.push("hidden");
    }

    const inputHandler = (e) => {
      if(typeof this.props.inputHandler !== "function") {
        throw new Error("Missing inputHandler prop, expecting type function");
      }
      
      this.props.inputHandler(e.target.value);
    };

    clearIconClasses = clearIconClasses.join(" ");
    return (
      <div className="search-component">
        <i className="material-icons">search</i>
        <input
          type="text"
          placeholder="Search"
          value={this.props.searchValue}
          onChange={inputHandler}
          ref={(input) => { this.searchInput = input; }} />
        <span className={clearIconClasses} onClick={this.clearSearch}>X</span>
      </div>
    );
  }
}
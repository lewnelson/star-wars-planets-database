export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  focus() {
    this.searchInput.focus();
  }

  clearSearch(e) {
    this.props.clearSearchValue(e);
    this.focus();
  }

  render() {
    let clearIconClasses = [
      "icon"
    ];

    if(this.props.searchValue === "") {
      clearIconClasses.push("hidden");
    }

    clearIconClasses = clearIconClasses.join(" ");
    return (
      <div className="search-component">
        <i className="material-icons">search</i>
        <input
          type="text"
          value={this.props.searchValue}
          onInput={this.props.inputHandler}
          onChange={this.props.inputHandler}
          ref={(input) => { this.searchInput = input; }} />
        <span className={clearIconClasses} onClick={this.clearSearch}>X</span>
      </div>
    );
  }
}
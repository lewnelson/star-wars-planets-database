import { Search } from "./Search.js";

export class Planets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ""
    };

    this.inputHandler = this.inputHandler.bind(this);
    this.getSearchValue = this.getSearchValue.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
  }

  inputHandler(event) {
    this.setState({
      searchValue: event.target.value
    });
  }

  getSearchValue() {
    return this.state.searchValue;
  }

  clearSearchValue() {
    this.setState({
      searchValue: ""
    });
  }

  render() {
    return (
      <div className="planets-component">
        <Search inputHandler={this.inputHandler} searchValue={this.getSearchValue()} clearSearchValue={this.clearSearchValue} />
      </div>
    );
  }
}
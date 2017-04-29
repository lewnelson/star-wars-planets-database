"use strict";

import { Loader } from "../Loader.js";

/**
 *  Renders the td cell from field object and value.
 *
 *  Accepts following props
 *   - field : {object} Single field object
 *   - value : {string|array} Optional, will resolve to `N/A` when not defined
 */
export class TableDataCell extends React.Component {
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
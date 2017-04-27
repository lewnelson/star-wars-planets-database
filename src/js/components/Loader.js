"use strict";

export class Loader extends React.Component {
  render() {
    let classes = ["loader-container"];
    if(this.props.loading === true) {
      classes.push("loading");
    }

    return (
      <div className={classes.join(" ")}>
        <div className="loader">
        </div>
      </div>
    );
  }
}
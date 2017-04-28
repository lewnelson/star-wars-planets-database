"use strict";

/**
 *  Loader component accepts single prop `loading` which should be a boolean
 *  and defaults to false when not explicitly set to true. Rendered state is
 *  controlled via classes, when loading the  a class name of `loading` is
 *  added to the component.
 */
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
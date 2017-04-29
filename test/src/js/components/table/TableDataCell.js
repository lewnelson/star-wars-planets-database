"use strict";

import {TableDataCell} from "../../../../../src/js/components/table/TableDataCell.js";
import {shallow, mount} from "enzyme";
import {expect} from "chai";
import {stub} from "sinon";

describe("<TableDataCell />", () => {
  it("should have cell and field key class by default", () => {
    let field = {key: "key"};
    const wrapper = shallow(<TableDataCell field={field} />);
    expect(wrapper.hasClass("cell")).to.be.true;
    expect(wrapper.hasClass(field.key)).to.be.true;
  });

  it("should render a loader component", () => {
    const wrapper = shallow(<TableDataCell field={{}} />);
    expect(wrapper.find("Loader")).to.have.length(1);
  });

  it("should render apply a loading class when loading prop is true", (done) => {
    const wrapper = shallow(<TableDataCell field={{}} />);
    wrapper.setState({loading: true}, () => {
      expect(wrapper.hasClass("loading")).to.be.true;
      done();
    });
  });

  it("should resolve value once mounted and display each value component in a span tag", () => {
    let dataSets = [
      {
        value: undefined,
        expectedResolvedValues: ["N/A"]
      },
      {
        value: null,
        expectedResolvedValues: ["N/A"]
      },
      {
        value: ["one", "two"],
        expectedResolvedValues: ["one", "two"]
      },
      {
        value: [100],
        expectedResolvedValues: ["100"]
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = mount(<TableDataCell field={{}} value={dataSet.value} />);
      const spans = wrapper.find("span");
      spans.forEach((span) => {
        expect(span.text()).to.equal(dataSet.expectedResolvedValues.shift());
      });
    }
  });

  it("should be able to resolve value from function when a field has value type function", () => {
    let dataSets = [
      {
        field: {
          value: (v) => "actual value"
        },
        value: true,
        expectedResolvedValues: ["actual value"]
      },
      {
        field: {
          value: (v) => "field functions should take priority"
        },
        value: undefined,
        expectedResolvedValues: ["field functions should take priority"]
      },
      {
        field: {
          value: (v) => undefined
        },
        value: "initial",
        expectedResolvedValues: ["N/A"]
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = mount(<TableDataCell field={dataSet.field} value={dataSet.value} />);
      const spans = wrapper.find("span");
      spans.forEach((span) => {
        expect(span.text()).to.equal(dataSet.expectedResolvedValues.shift());
      });
    }
  });

  it("should be able to resolve a promise return value from a field value function and when promise is resolved update accordingly", () => {
    let promise = new Promise((resolve) => {
          return "value"
        }),
        field = {
          value: (v) => promise
        },
        expectedResolvedValues = ["value"];

    const wrapper = mount(<TableDataCell field={field} />);
    Promise.resolve(promise).finally(() => {
      const spans = wrapper.find("span");
      spans.forEach((span) => {
        expect(span.text()).to.equal(expectedResolvedValues.shift());
      });
    });
  });

  it("should be able to resolve a promise return value from a field value function and when promise is resolved to undefined set value as N/A", () => {
    let resolvedPromise = new Promise((resolve) => undefined),
        promise = new Promise((resolve, reject) => {
          resolve(undefined);
          Promise.resolve(resolvedPromise);
        }),
        initialValue = "initial",
        field = {
          value: (v) => promise
        },
        expectedResolvedValues = ["N/A"];

    const wrapper = mount(<TableDataCell field={field} value={initialValue} />);
    resolvedPromise.then(() => {
      const spans = wrapper.find("span");
      spans.forEach((span) => {
        expect(span.text()).to.equal(expectedResolvedValues.shift());
      });
    });
  });

  it("should be able to resolve a promise return value from a field value function and when promise is rejected update accordingly", () => {
    let rejectionPromise = new Promise((resolve) => undefined),
        promise = new Promise((resolve, reject) => {
          reject(new Error());
          Promise.resolve(rejectionPromise);
        }),
        field = {
          value: (v) => promise
        },
        expectedResolvedValues = ["ERROR"];

    const wrapper = mount(<TableDataCell field={field} />);
    rejectionPromise.then(() => {
      const spans = wrapper.find("span");
      spans.forEach((span) => {
        expect(span.text()).to.equal(expectedResolvedValues.shift());
      });
    });
  });

  it("should cancel any promise in progress if unmounted", () => {
    let promise = new Promise((resolve) => "new"),
        field = {
          value: (v) => promise
        },
        value = "initial",
        expectedResolvedValues = ["new"];

    const wrapper = mount(<TableDataCell field={field} />);
    wrapper.unmount();
    expect(promise.isCancelled()).to.be.true;
  });

  it("should set loading state to true when resolved value is promise and then set back to false when resolved", () => {
    let promise = new Promise((resolve) => undefined),
        field = {
          value: (v) => promise
        };

    const wrapper = mount(<TableDataCell field={field} />);
    expect(wrapper.state("loading")).to.be.true;
    Promise.resolve(promise).finally(() => {
      expect(wrapper.state("loading")).to.be.false;
    });
  });

  it("should set loading state to true when resolved value is promise and then set back to false when rejected", () => {
    let rejectionPromise = new Promise((resolve) => undefined),
        promise = new Promise((resolve, reject) => {
          reject(new Error());
          Promise.resolve(rejectionPromise);
        }),
        field = {
          value: (v) => promise
        };

    const wrapper = mount(<TableDataCell field={field} />);
    expect(wrapper.state("loading")).to.be.true;
    rejectionPromise.then(() => {
      expect(wrapper.state("loading")).to.be.false;
    });
  });
});
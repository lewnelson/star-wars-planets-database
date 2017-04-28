"use strict";

import {Loader} from "../../../../src/js/components/Loader.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<Loader />", () => {
  it("should have prop loading undefined by default", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper.props().loader).to.be.undefined;
  });

  it("should always have loader div", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper.find(".loader")).to.have.length(1);
    wrapper.setProps({loading: true});
    expect(wrapper.find(".loader")).to.have.length(1);
  });

  it("should have class loader-container", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper.hasClass("loader-container")).to.be.true;
  });

  it("should have class loading when loading prop is true", () => {
    const wrapper = shallow(<Loader loading={true} />);
    expect(wrapper.hasClass("loading")).to.be.true;
  });
});
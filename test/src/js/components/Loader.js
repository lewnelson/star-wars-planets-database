"use strict";

import {Loader} from "../../../../src/js/components/Loader.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<Loader />", () => {
  it("should have prop loading undefined by default", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper.find(".loader")).to.have.length(1);
  });
});
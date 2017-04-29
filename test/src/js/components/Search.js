"use strict";

import {Search} from "../../../../src/js/components/Search.js";
import {shallow, mount} from "enzyme";
import {expect} from "chai";
import {spy} from "sinon";

describe("<Search />", () => {
  it("should have a clear search icon", () => {
    const wrapper = shallow(<Search />);
    expect(wrapper.find("span.icon")).to.have.length(1);
  });

  it("should have hidden clear search when input value is not defined", () => {
    const wrapper = shallow(<Search />);
    expect(wrapper.find("span.icon").hasClass("hidden")).to.be.true;
  });

  it("should have clear search visible when search input has value", () => {
    const wrapper = shallow(<Search searchValue="val" />);
    expect(wrapper.find("span.icon").hasClass("hidden")).to.be.false;
  });

  it("should invoke props clearSearchValue when the clear search icon is clicked", () => {
    const clearSearchValue = spy();
    const wrapper = mount(<Search searchValue="val" clearSearchValue={clearSearchValue} />);
    wrapper.find("span.icon").simulate("click");
    expect(clearSearchValue).to.have.property("callCount", 1);
  });

  it("should focus on search input when clear search icon is clicked", () => {
    const clearSearchValue = spy();
    const focusSpy = spy();
    const wrapper = mount(<Search searchValue="val" clearSearchValue={clearSearchValue} />);
    const input = wrapper.find("input");
    input.focus = focusSpy;
    wrapper.find("span.icon").simulate("click");
  });

  it("should call props on input handler when input onChange", () => {
    const inputHandler = spy();
    const wrapper = mount(<Search inputHandler={inputHandler} />);
    const input = wrapper.find("input");
    input.simulate("change", {
      target: {
        value: "test"
      }
    });

    expect(inputHandler).to.have.property("callCount", 1);
  });
});
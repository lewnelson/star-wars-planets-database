"use strict";

import {TableBody} from "../../../../../src/js/components/table/TableBody.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<TableBody />", () => {
  it("should display empty results data when no data is defined", () => {
    const wrapper = shallow(<TableBody />);
    expect(wrapper.find(".table-empty-data")).to.have.length(1);
  });

  it("should render a TableRow component for each data set", () => {
    let data = [
      {
        key: "data",
        value: "integer",
        field: 100
      },
      {
        key: "data",
        value: "string",
        field: "value"
      }
    ];

    const wrapper = shallow(<TableBody data={data} />);
    const rows = wrapper.find("TableRow");
    expect(rows).to.have.length(data.length);
    rows.forEach((row) => {
      expect(row.prop("data")).to.deep.equal(data.shift());
    });
  });

  it("should display a Loader component passing the loading prop", () => {
    const wrapper = shallow(<TableBody loading="loading" />);
    const loader = wrapper.find("Loader");
    expect(loader).to.have.length(1);
    expect(loader.prop("loading")).to.equal("loading");
  });
});
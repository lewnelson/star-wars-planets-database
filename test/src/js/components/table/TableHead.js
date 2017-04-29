"use strict";

import {TableHead} from "../../../../../src/js/components/table/TableHead.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<TableHead />", () => {
  it("should render no table head cells when no fields prop is defined", () => {
    const wrapper = shallow(<TableHead />);
    expect(wrapper.find("TableHeadCell")).to.have.length(0);
  });

  it("should render a table head cell for each field defined in props and pass on field", () => {
    let fields = [
      {label: "field one"},
      {label: "field two"}
    ];

    const wrapper = shallow(<TableHead fields={fields} />);
    const cells = wrapper.find("TableHeadCell");
    cells.map((cell) => {
      expect(cell.prop("field")).to.deep.equal(fields.shift());
    });
  });
});
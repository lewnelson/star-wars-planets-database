"use strict";

import {TableRow} from "../../../../../src/js/components/table/TableRow.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<TableRow />", () => {
  it("should not render any data cells when no fields are passed", () => {
    const wrapper = shallow(<TableRow />);
    expect(wrapper.find("TableDataCell")).to.have.length(0);
  });

  it("should render a table data cell for every field regardless of whether or not the data exists for that field", () => {
    let dataSets = [
      {
        fields: [
          {
            key: "field_one"
          },
          {
            key: "field_two"
          }
        ],
        data: {
          field_one: "value one"
        },
        expectedValues: ["value one", null]
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = shallow(<TableRow data={dataSet.data} fields={dataSet.fields} />);
      wrapper.find("TableDataCell").forEach((cell) => {
        expect(cell.prop("value")).to.equal(dataSet.expectedValues.shift());
      });
    }
  });
});
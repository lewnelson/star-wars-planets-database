"use strict";

import {TableHeadCell} from "../../../../../src/js/components/table/TableHeadCell.js";
import {shallow} from "enzyme";
import {expect} from "chai";
import {spy} from "sinon";

describe("<TableHeadCell />", () => {
  it("should render with correct direction class based on the sorting prop", () => {
    let dataSets = [
      {
        sorting: {
          key: "key",
          direction: 0
        },
        field: {
          key: "key"
        },
        classes: [
          {
            name: "sort-descending",
            has: false
          },
          {
            name: "sort-ascending",
            has: false
          }
        ]
      },
      {
        sorting: {
          key: "key",
          direction: 1
        },
        field: {
          key: "key"
        },
        classes: [
          {
            name: "sort-ascending",
            has: true
          },
          {
            name: "sort-descending",
            has: false
          }
        ]
      },
      {
        sorting: {
          key: "key",
          direction: -1
        },
        field: {
          key: "key"
        },
        classes: [
          {
            name: "sort-ascending",
            has: false
          },
          {
            name: "sort-descending",
            has: true
          }
        ]
      },
      {
        sorting: {
          key: "key",
          direction: -1
        },
        field: {
          key: "anotherKey"
        },
        classes: [
          {
            name: "sort-descending",
            has: false
          },
          {
            name: "sort-ascending",
            has: false
          }
        ]
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = shallow(<TableHeadCell sorting={dataSet.sorting} field={dataSet.field} />);
      while(dataSet.classes.length > 0) {
        let classObj = dataSet.classes.shift();
        expect(wrapper.hasClass(classObj.name)).to.be[String(classObj.has)];
      }
    }
  });

  it("should have sortable class if prop field sortable is true", () => {
    let field = {sortable: true};
    const wrapper = shallow(<TableHeadCell field={field} />);
    expect(wrapper.hasClass("sortable")).to.be.true;
  });

  it("should display field label as text", () => {
    let field = {
      label: "text"
    };

    const wrapper = shallow(<TableHeadCell field={field} />);
    expect(wrapper.text()).to.equal(field.label);
  });

  it("should not call set sorting on prop when field is not sortable", () => {
    let field = {},
        setSorting = spy();

    const wrapper = shallow(<TableHeadCell field={field} setSorting={setSorting} />);
    wrapper.simulate("click");
    expect(setSorting).to.have.property("callCount", 0);
  });

  it("should call set sorting on prop when field is sortable", () => {
    let field = {
          sortable: true
        },
        setSorting = spy();

    const wrapper = shallow(<TableHeadCell field={field} setSorting={setSorting} />);
    wrapper.simulate("click");
    expect(setSorting).to.have.property("callCount", 1);
  });
});
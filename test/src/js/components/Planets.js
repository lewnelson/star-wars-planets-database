"use strict";

import {Planets} from "../../../../src/js/components/Planets.js";
import {shallow, mount} from "enzyme";
import {expect} from "chai";
import moxios from "moxios";
import {spy} from "sinon";

describe("<Planets />", () => {
  beforeEach(function () {
    moxios.install()
  });

  afterEach(function () {
    moxios.uninstall()
  });

  it("should have default component class", () => {
    const wrapper = shallow(<Planets />);
    expect(wrapper.hasClass("planets-component")).to.be.true;
  });

  it("should have loading class when loading state is true", () => {
    const wrapper = shallow(<Planets />);
    wrapper.setState({loading: true}, () => {
      expect(wrapper.hasClass("loading")).to.be.true;
    });
  });

  it("should render search component with correct prop type values", () => {
    const wrapper = shallow(<Planets />);
    const search = wrapper.find("Search");
    expect(search.prop("inputHandler")).to.be.a("function");
    expect(search.prop("searchValue")).to.be.a("string");
    expect(search.prop("clearSearchValue")).to.be.a("function");
  });

  it("should render a pagination component with correct prop types", () => {
    const wrapper = shallow(<Planets />);
    const pagination = wrapper.find("Pagination");
    expect(pagination.prop("goToPage")).to.be.a("function");
    expect(pagination.prop("totalPages")).to.be.a("number");
    expect(pagination.prop("currentPage")).to.be.a("number");
  });

  it("should render a table component with correct prop types and no error element", () => {
    const wrapper = shallow(<Planets />);
    const table = wrapper.find("Table");
    expect(table.prop("loading")).to.be.a("boolean");
    expect(table.prop("data")).to.be.a("Array");
    expect(table.prop("fields")).to.be.a("Array");
    expect(wrapper.find(".data-error")).to.have.length(0);
  });

  it("should render an error element instead of a table when error state is true", () => {
    const wrapper = shallow(<Planets />);
    wrapper.setState({error: true}, () => {
      expect(wrapper.find(".data-error")).to.have.length(1);
      expect(wrapper.find("Table")).to.have.length(0);
    });
  });

  it("should pass fields to Table in a format that is valid for the table component", () => {
    const testFieldObjects = [
      {
        key: "key",
        required: true,
        validate: (v) => {
          expect(v).to.be.a("string");
        }
      },
      {
        key: "label",
        required: true,
        validate: (v) => {
          expect(v).to.be.a("string");
        }
      },
      {
        key: "sortable",
        required: false,
        validate: (v) => {
          expect(v).to.be.a("boolean");
        }
      },
      {
        key: "value",
        required: false,
        validate: (v) => {
          expect(v).to.be.a("function");
        }
      }
    ];

    const wrapper = shallow(<Planets />);
    const fields = wrapper.find("Table").prop("fields");
    expect(fields).to.be.a("Array");
    while(fields.length > 0) {
      let field = fields.shift();
      expect(field).to.be.a("Object");
      testFieldObjects.slice(0).map((tf) => {
        expect(tf.required === true ? field[tf.key] !== undefined : true).to.be.true;
        if(field[tf.key] !== undefined) {
          tf.validate(field[tf.key]);
        }
      });
    }
  });

  it("should update search value to empty string when clearSearchValue is invoked and page to 1", () => {
    moxios.stubRequest(/.*/, {});
    const wrapper = shallow(<Planets />);
    const clearSearchValue = wrapper.find("Search").prop("clearSearchValue");
    clearSearchValue(() => {
      expect(wrapper.state("page")).to.equal(1);
    });
  });

  it("should update search value to value string when searchInputHandler is invoked and page to 1", () => {
    moxios.stubRequest(/.*/, {});
    const wrapper = shallow(<Planets />);
    const searchInputHandler = wrapper.find("Search").prop("inputHandler");
    searchInputHandler("test", () => {
      expect(wrapper.state("searchValue")).to.equal("test");
      expect(wrapper.state("page")).to.equal(1);
    });
  });

  it("should update page value to value number when goToPage is invoked", () => {
    moxios.stubRequest(/.*/, {});
    const wrapper = shallow(<Planets />);
    const goToPage = wrapper.find("Pagination").prop("goToPage");
    goToPage(5, () => expect(wrapper.state("page")).to.equal(5));
  });
});
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

  it("should always return 1 from getTotalPages when the result count is less than 1", (done) => {
    const wrapper = shallow(<Planets />);
    let dataSets = [
      -5,
      0
    ];

    /**
     *  Recursively test each data set
     *
     *  @return {void}
     */
    function testGetTotalPages() {
      let next = dataSets.shift();
      if(next === undefined) {
        done();
        return;
      }

      wrapper.setState({result: {count: next}}, () => {
        expect(wrapper.find("Pagination").prop("totalPages")).to.equal(1);
        testGetTotalPages();
      });
    }

    testGetTotalPages();
  });

  it("should return a promise for the film field which will resolve when swapi call is successful", (done) => {
    const wrapper = shallow(<Planets />);
    const table = wrapper.find("Table");
    let filmValues = {
          initialValues: ["/films/1", "/films/2"],
          urlPatterns: [/^.*?\/films\/1$/, /^.*?\/films\/2$/],
          expectedResponses: [{title: "film 1"}, {title: "Film 2"}],
          expectedResolvedValue: ["film 1", "Film 2"]
        },
        filmField = table.prop("fields").filter((field) => field.key === "films").shift();

    expect(filmField).not.to.equal(undefined);
    for(let i = 0; i < filmValues.urlPatterns.length; i++) {
      moxios.stubRequest(filmValues.urlPatterns[i], {status: 200, response: filmValues.expectedResponses[i]});
    }

    let promise = filmField.value(filmValues.initialValues);
    promise.then((resolved) => {
      expect(resolved).to.deep.equal(filmValues.expectedResolvedValue);
      done();
    });
  });

  it("should return a promise for the film field which will be rejected when any swapi call it calls is unsuccessful", () => {
    const wrapper = shallow(<Planets />);
    const table = wrapper.find("Table");
    let filmValues = {
          initialValues: ["/films/1"],
          urlPatterns: [/^.*?\/films\/1$/]
        },
        filmField = table.prop("fields").filter((field) => field.key === "films").shift();

    expect(filmField).not.to.equal(undefined);
    for(let i = 0; i < filmValues.urlPatterns.length; i++) {
      moxios.stubRequest(filmValues.urlPatterns[i], {status: 500, response: []});
    }

    let promise = filmField.value(filmValues.initialValues);
    promise.catch((rejected) => {
      expect(rejected).to.be.an.instanceof(Error);
      done();
    });
  });

  it("should resolve terrain field values from a CSV string to an array trimming the values of the CSV", () => {
    const wrapper = shallow(<Planets />);
    let field = wrapper.find("Table").prop("fields").filter((field) => field.key === "terrain").shift();
    let dataSets = [
      {
        initialValue: "",
        expectedValues: []
      },
      {
        initialValue: "one, two",
        expectedValues: ["one", "two"]
      },
      {
        initialValue: "terrain one,terrain two , terrain three",
        expectedValues: ["terrain one", "terrain two", "terrain three"]
      }
    ];

    expect(field).not.to.equal(undefined);
    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      expect(field.value(dataSet.initialValue)).to.deep.equal(dataSet.expectedValues);
    }
  });

  it("should cancel any request in progress when loading the result", (done) => {
    const wrapper = mount(<Planets />);
    let initialRequest = wrapper.nodes.shift().requestInProgress;
    // Trigger loadResult for second time
    wrapper.setState({searchValue: "diff"}, () => {
      expect(initialRequest.isCancelled()).to.be.true;
      done();
    });
  });

  it("should add search query parameter when searchValue state is a non empty string", (done) => {
    const wrapper = shallow(<Planets />);
    wrapper.setState({searchValue: "searchTerm"}, () => {
      moxios.wait(() => {
        let requestUrl = moxios.requests.mostRecent().url,
            queries = requestUrl.replace(/^.*?\?(.*)$/, "$1").split("&");

        expect(queries.indexOf("search=searchTerm")).to.be.at.least(0);
        done();
      });
    });
  });

  it("should add page query parameter when page state is not undefined", (done) => {
    const wrapper = shallow(<Planets />);
    wrapper.setState({page: 4}, () => {
      moxios.wait(() => {
        let requestUrl = moxios.requests.mostRecent().url,
            queries = requestUrl.replace(/^.*?\?(.*)$/, "$1").split("&");

        expect(queries.indexOf("page=4")).to.be.at.least(0);
        done();
      });
    });
  });
});
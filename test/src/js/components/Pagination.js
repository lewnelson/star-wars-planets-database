"use strict";

import {Pagination} from "../../../../src/js/components/Pagination.js";
import {shallow, mount} from "enzyme";
import {expect} from "chai";
import {spy} from "sinon";

describe("<Pagination />", () => {
  it("should have first disabled when current page is 1", () => {
    let totalPages = 2,
        currentPage = 1;

    const wrapper = shallow(<Pagination totalPages={totalPages} currentPage={currentPage} />);
    const first = wrapper.find(".first");
    expect(first.hasClass("disabled")).to.be.true;
  });

  it("should have previous disabled when current page is 1", () => {
    let totalPages = 2,
        currentPage = 1;

    const wrapper = shallow(<Pagination totalPages={totalPages} currentPage={currentPage} />);
    const previous = wrapper.find(".previous");
    expect(previous.hasClass("disabled")).to.be.true;
  });

  it("should throw an error when currentPage is not defined", () => {
    let totalPages = 2;
    expect(() => shallow(<Pagination totalPages={totalPages} />)).to.throw(Error);
  });

  it("should throw an error when totalPages is not defined", () => {
    let currentPage = 1;
    expect(() => shallow(<Pagination currentPage={currentPage} />)).to.throw(Error);
  });

  it("should throw an error when currentPage is less than 1", () => {
    let currentPage = 0;
    expect(() => shallow(<Pagination currentPage={currentPage} />)).to.throw(Error);
  });

  it("should throw an error when currentPage is greate than totalPages", () => {
    let currentPage = 3,
        totalPages = 1;

    expect(() => shallow(<Pagination currentPage={currentPage} totalPages={totalPages} />)).to.throw(Error);
  });

  it("should have last disabled when current page is equal to total pages", () => {
    let totalPages = 5,
        currentPage = 5;

    const wrapper = shallow(<Pagination totalPages={totalPages} currentPage={currentPage} />);
    const last = wrapper.find(".last");
    expect(last.hasClass("disabled")).to.be.true;
  });

  it("should have next disabled when current page is equal to total pages", () => {
    let totalPages = 5,
        currentPage = 5;

    const wrapper = shallow(<Pagination totalPages={totalPages} currentPage={currentPage} />);
    const next = wrapper.find(".next");
    expect(next.hasClass("disabled")).to.be.true;
  });

  // Ellipsis are counted as a page
  it("should have the correct number of pages displayed", () => {
    let dataSets = [
      {
        totalPages: 7,
        currentPage: 1,
        expectedPagesDisplayed: 3
      },
      {
        totalPages: 7,
        currentPage: 2,
        expectedPagesDisplayed: 4
      },
      {
        totalPages: 12,
        currentPage: 11,
        expectedPagesDisplayed: 3
      },
      {
        totalPages: 2,
        currentPage: 1,
        expectedPagesDisplayed: 2
      },
      {
        totalPages: 1,
        currentPage: 1,
        expectedPagesDisplayed: 1
      },
      {
        totalPages: 2,
        currentPage: 2,
        expectedPagesDisplayed: 2
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = shallow(<Pagination totalPages={dataSet.totalPages} currentPage={dataSet.currentPage} />);
      expect(wrapper.find(".page-number")).to.have.length(dataSet.expectedPagesDisplayed);
    }
  });

  it("should have the correct page number marked as active", () => {
    let dataSets = [
      {
        totalPages: 7,
        currentPage: 6
      },
      {
        totalPages: 7,
        currentPage: 4
      }
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift();
      const wrapper = shallow(<Pagination totalPages={dataSet.totalPages} currentPage={dataSet.currentPage} />);
      expect(wrapper.find(".page-number.active").prop("value")).to.equal(dataSet.currentPage);
    }
  });

  it("should go to page 1 when first is clicked and currentPage is not 1", () => {
    let totalPages = 5,
        currentPage = 5,
        pageSelected;

    const goToPage = (p) => pageSelected = p;
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".first").simulate("click");
    expect(pageSelected).to.equal(1);
  });

  it("should go to currentPage - 1 when previous page is clicked and currentPage is greater than 1", () => {
    let totalPages = 5,
        currentPage = 5,
        pageSelected;

    const goToPage = (p) => pageSelected = p;
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".previous").simulate("click");
    expect(pageSelected).to.equal(currentPage - 1);
  });

  it("should go to totalPages when last is clicked and currentPage is not equal to totalPages", () => {
    let totalPages = 5,
        currentPage = 3,
        pageSelected;

    const goToPage = (p) => pageSelected = p;
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".last").simulate("click");
    expect(pageSelected).to.equal(totalPages);
  });

  it("should go to currentPage + 1 when next page is clicked and currentPage is less than totalPages", () => {
    let totalPages = 5,
        currentPage = 2,
        pageSelected;

    const goToPage = (p) => pageSelected = p;
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".next").simulate("click");
    expect(pageSelected).to.equal(currentPage + 1);
  });

  it("should not call goToPage when first is clicked and currentPage is 1", () => {
    let totalPages = 1,
        currentPage = 1;

    const goToPage = spy();
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".first").simulate("click");
    expect(goToPage).to.have.property("callCount", 0);
  });

  it("should not call goToPage when previous is clicked and currentPage is 1", () => {
    let totalPages = 1,
        currentPage = 1;

    const goToPage = spy();
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".previous").simulate("click");
    expect(goToPage).to.have.property("callCount", 0);
  });

  it("should not call goToPage when last is clicked and currentPage is totalPages", () => {
    let totalPages = 1,
        currentPage = 1;

    const goToPage = spy();
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".last").simulate("click");
    expect(goToPage).to.have.property("callCount", 0);
  });

  it("should not call goToPage when next is clicked and currentPage is totalPages", () => {
    let totalPages = 1,
        currentPage = 1;

    const goToPage = spy();
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    wrapper.find(".next").simulate("click");
    expect(goToPage).to.have.property("callCount", 0);
  });

  it("should go to the page value on the non active page-number element when it is clicked", () => {
    let totalPages = 5,
        currentPage = 2,
        pageSelected,
        nonActivePages = 0;

    const goToPage = (p) => pageSelected = p;
    const wrapper = mount(<Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />);
    const pages = wrapper.find(".page-number");
    pages.forEach((page) => {
      if(!page.hasClass("active")) {
        page.simulate("click");
        expect(pageSelected).to.equal(page.prop("value"));
        nonActivePages++;
      }
    });

    expect(nonActivePages).to.equal(pages.length - 1);
  });
});
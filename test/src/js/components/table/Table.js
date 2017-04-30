"use strict";

import {Table} from "../../../../../src/js/components/table/Table.js";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("<Table />", () => {
  it("will sort not sort data for table body when no sorting key and direction are defined in state", () => {
    let data = [
      {
        type: "data",
        value: 1
      },
      {
        type: "data",
        value: 4
      },
      {
        type: "data",
        value: 3
      }
    ];

    const wrapper = shallow(<Table data={data} />);
    expect(wrapper.find("TableBody").prop("data")).to.deep.equal(data);
  });

  it("will sort not sort data for table body when direction is 0", (done) => {
    let data = [
      {
        type: "data",
        value: 1
      },
      {
        type: "data",
        value: 4
      },
      {
        type: "data",
        value: 3
      }
    ];

    const wrapper = shallow(<Table data={data} />);
      wrapper.setState({sorting:{key: "value", direction: 0}}, () => {
        expect(wrapper.find("TableBody").prop("data")).to.deep.equal(data);
        done();
      });
  });

  it("will sort data in ascending order from state sorting key and when direction is 1", (done) => {
    let dataSets = [
      [
        [
          {
            key: "alpha"
          },
          {
            key: "gamma"
          },
          {
            key: "delta"
          },
          {
            key: "Charlie"
          }
        ],
        [
          {
            key: "alpha"
          },
          {
            key: "Charlie"
          },
          {
            key: "delta"
          },
          {
            key: "gamma"
          }
        ]
      ],
      [
        [
          {
            key: undefined
          },
          {
            key: 100
          },
          {
            key: "05"
          },
          {
            key: "N/A"
          }
        ],
        [
          {
            key: "N/A"
          },
          {
            key: undefined
          },
          {
            key: "05"
          },
          {
            key: 100
          }
        ]
      ],
      [
        [
          {
            key: 50
          },
          {
            key: "50"
          },
          {
            key: 50
          },
          {
            key: 50
          }
        ],
        [
          {
            key: 50
          },
          {
            key: "50"
          },
          {
            key: 50
          },
          {
            key: 50
          }
        ]
      ]
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift(),
          data = dataSet[0],
          expectedSortedData = dataSet[1];

      const wrapper = shallow(<Table data={data} />);
      wrapper.setState({sorting:{key: "key", direction: 1}}, () => {
        expect(wrapper.find("TableBody").prop("data")).to.deep.equal(expectedSortedData);
        if(dataSets.length === 0) {
          done();
        }
      });
    }
  });

  it("will sort data in descending order from state sorting key and when direction is -1", (done) => {
    let dataSets = [
      [
        [
          {
            key: "alpha"
          },
          {
            key: "gamma"
          },
          {
            key: "delta"
          },
          {
            key: "Charlie"
          }
        ],
        [
          {
            key: "gamma"
          },
          {
            key: "delta"
          },
          {
            key: "Charlie"
          },
          {
            key: "alpha"
          }
        ]
      ],
      [
        [
          {
            key: undefined
          },
          {
            key: 100
          },
          {
            key: "05"
          },
          {
            key: "N/A"
          }
        ],
        [
          {
            key: 100
          },
          {
            key: "05"
          },
          {
            key: undefined
          },
          {
            key: "N/A"
          }
        ]
      ],
      [
        [
          {
            key: 50
          },
          {
            key: "50"
          },
          {
            key: 50
          },
          {
            key: 50
          }
        ],
        [
          {
            key: 50
          },
          {
            key: "50"
          },
          {
            key: 50
          },
          {
            key: 50
          }
        ]
      ]
    ];

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift(),
          data = dataSet[0],
          expectedSortedData = dataSet[1];

      const wrapper = shallow(<Table data={data} />);
      wrapper.setState({sorting:{key: "key", direction: -1}}, () => {
        expect(wrapper.find("TableBody").prop("data")).to.deep.equal(expectedSortedData);
        if(dataSets.length === 0) {
          done();
        }
      });
    }
  });

  it("should pass setSorting as prop to thead", () => {
    const wrapper = shallow(<Table />);
    expect(wrapper.find("TableHead").prop("setSorting")).to.be.a("function");
  });

  it("should cycle through sorting states when setSorting is triggered", (done) => {
    let dataSets = [
      {
        initialState: {
          sorting: {
            key: "values",
            direction: -1
          }
        },
        key: "values",
        expectedDirections: [0, 1, -1]
      },
      {
        initialState: {
          sorting: {
            key: "key",
            direction: 1
          }
        },
        key: "newKey",
        expectedDirections: [1, -1, 0]
      },
      {
        initialState: {
          sorting: {}
        },
        key: "values",
        expectedDirections: [1, -1, 0]
      }
    ];

    /**
     *  Recursively updates direction and then checks expectedDirection, calls
     *  until expecteDirections array is empty.
     *
     *  @param {Component} wrapper The Enzyme shallow wrapper
     *  @param {string} sortingKey
     *  @param {array} expectedDirections
     *  @param {bool} last Is this the last data set to test
     *  @return {void}
     */
    function testSetSorting(wrapper, sortingKey, expectedDirections, last) {
      let expectedDirection = expectedDirections.shift();
      wrapper.find("TableHead").prop("setSorting")(sortingKey, () => {
        expect(wrapper.state("sorting").direction).to.equal(expectedDirection);
        if(last === true && expectedDirections.length === 0) {
          done();
        } else if(expectedDirections.length > 0) {
          testSetSorting(wrapper, sortingKey, expectedDirections, last);
        }
      });
    }

    /**
     *  Function required to set state and use wrapper variable, if not wrapped
     *  in this function then wrapper variable is overwritten on each loop
     *  iteration
     *
     *  @param {object} dataSet
     *  @param {bool} last
     *  @return {void}
     */
    function testDataset(dataSet, last) {
      let wrapper = shallow(<Table />);
      wrapper.setState(dataSet.initialState, () => {
        testSetSorting(wrapper, dataSet.key, dataSet.expectedDirections, last);
      });
    }

    while(dataSets.length > 0) {
      let dataSet = dataSets.shift(),
          last = dataSets.length < 1;

      testDataset(dataSet, last);
    }
  });
});
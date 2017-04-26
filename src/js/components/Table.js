"use strict";

export class Table extends React.Component {
  render() {
    return (
      <table>
        <TableHead
          fields={this.props.fields}
          sortData={this.props.sortData}
          getSortDirection={this.props.getSortDirection}
          sortKey={this.props.sortKey} />

        <TableBody
          data={this.props.data}
          fields={this.props.fields} />
      </table>
    );
  }
}

class TableHead extends React.Component {
  getThElements() {
    let fields = this.props.fields.slice(0),
        thElems = [];

    while(fields.length > 0) {
      let field = fields.shift();
      thElems.push(
        <TableHeadCell
          key={field.key}
          sortData={this.props.sortData}
          getSortDirection={this.props.getSortDirection}
          field={field} />
      );
    }

    return thElems;
  }

  render() {
    return (
      <thead>
        <tr>
          {this.getThElements()}
        </tr>
      </thead>
    );
  }
}

class TableHeadCell extends React.Component {
  constructor(props) {
    super(props);
    this.sortData = this.sortData.bind(this);
  }

  sortData() {
    if(this.props.field.sortable !== true) {
      return;
    }

    this.props.sortData(this.props.field.key);
  }

  render() {
    let classes = [],
        sortDirection = this.props.getSortDirection(this.props.field.key);
        
    if(sortDirection > 0) {
      classes.push("sort-ascending");
    } else if(sortDirection < 0) {
      classes.push("sort-descending");
    }

    return (
      <th
        className={classes.join("")}
        onClick={this.sortData}>
        {this.props.field.label}
      </th>
    );
  }
}

class TableBody extends React.Component {
  getDataRows() {
    let rows = [],
        data = this.props.data || [];

    data = data.slice(0);
    for(let i = 0; i < data.length; i++) {
      rows.push(<TableRow data={data[i]} fields={this.props.fields} key={data[i].url} />);
    }

    return rows;
  }

  render() {
    return (
      <tbody>
        {this.getDataRows()}
      </tbody>
    );
  }
}

class TableRow extends React.Component {
  getDataCells() {
    let fields = this.props.fields.slice(0),
        dataCells = [];

    while(fields.length > 0) {
      let field = fields.shift(),
          value = this.props.data[field.key] || null;

      dataCells.push(<TableDataCell field={field} value={value} data={this.props.data} key={field.key} />)
    }

    return dataCells;
  }

  render() {
    return (
      <tr>
        {this.getDataCells()}
      </tr>
    );
  };
}

class TableDataCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    this.resolveValue();
  }

  componentWillUnmount() {
    if(this.promise !== undefined) {
      this.promise.cancel();
    }
  }

  resolveValue() {
    let value = this.props.value;
    switch(true) {
      case value === null:
        this.setState({value: "N/A"});
        break;

      case (typeof this.props.field.value === "function"):
        let resolvedValue = this.props.field.value(value);
        if((resolvedValue instanceof Promise)) {
          this.promise = resolvedValue;
          resolvedValue.then((v) => this.setState({value: v})).catch((err) => this.setState({value: "ERR"}));
        } else if(typeof resolvedValue !== undefined) {
          this.setState({value: resolvedValue});
        } else {
          this.setState({value: "N/A"});
        }
        break;

      default:
        this.setState({value: value});
        break;
    }
  }

  getValues() {
    let value = (this.state.value instanceof Array) ? this.state.value : [this.state.value],
        values = [];

    for(let i = 0; i < value.length; i++) {
      values.push(<span key={i}>{value[i]}</span>)
    }

    return values;
  }

  render() {
    return (
      <td>{this.getValues()}</td>
    );
  }
}
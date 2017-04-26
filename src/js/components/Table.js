"use strict";

export class Table extends React.Component {
  render() {
    return (
      <table>
        <TableHead
          fields={this.props.fields} />

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
      thElems.push(<th key={field.key}>{field.label}</th>);
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

class TableBody extends React.Component {
  getDataRows() {
    let rows = [],
        data = this.props.data || [];

    data = data.slice(0);
    for(let i = 0; i < data.length; i++) {
      rows.push(<TableRow data={data[i]} fields={this.props.fields} key={i} />);
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

  resolveValue() {
    let value = this.props.value;
    switch(true) {
      case value === null:
        this.setState({value: "N/A"});
        break;

      case (typeof this.props.field.value === "function"):
        let resolvedValue = this.props.field.value(value);
        if((resolvedValue instanceof ES6Promise)) {
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
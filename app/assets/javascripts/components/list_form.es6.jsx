class ListForm extends React.Component {
  handleChange(e) {
    const name = e.target.name;
    const obj = {};
    obj[name] = e.target.value;
    this.props.onUserInput(obj);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit();
  }

  render() {
    return (
      <form className="form" onSubmit={ (event) => this.handleSubmit(event) }>
        <div className="form-group">
          <input name='name' className="form-control" value={ this.props.name }
                 onChange={ (event) => this.handleChange(event) }
                 placeholder="New list name"/>
        </div>
        <input type="submit" value="Create List"
               className="btn btn-success btn-block"/>
      </form>
    )
  }
}

class ListForm extends React.Component {
  handleChange(event) {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.props.onUserInput(obj);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onFormSubmit();
  }

  render() {
    return (
      <form className="form" onSubmit={ (event) => this.handleSubmit(event) }>
        <div className="form-group">
          <input name="name"
                 className="form-control"
                 value={ this.props.name }
                 onChange={ (event) => this.handleChange(event) }
                 placeholder="New list name"/>
        </div>
        <input type="submit"
               value="Create List"
               className="btn btn-success btn-block action-button"/>
      </form>
    )
  }
}

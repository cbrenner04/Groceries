class ListEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.list.name
    }
  }

  handleChange(event) {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit(event) {
    event.preventDefault();
    const list = {
      name: this.state.name
    }
    $.ajax({
      url: `/lists/${this.props.list.id}`,
      data: { list },
      method: "PUT"
    }).done(() => {
      window.location = '/lists';
    });
  }

  render() {
    return (
      <form className="form" onSubmit={ (event) => this.handleSubmit(event) }>
        { /* add alert for errors */ }
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input name="name"
                 className="form-control"
                 id="name"
                 value={ this.state.name }
                 onChange={ (event) => this.handleChange(event) } />
        </div>
        <input type="submit"
               value="Update List"
               className="btn btn-success btn-block action-button"/>
      </form>
    )
  }
}

class ListsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: props.lists,
      name: '',
      errors: '',
      success: ''
    }
  }

  handleUserInput(obj) {
    this.setState(obj);
  }

  handleFormSubmit() {
    const list = { name: this.state.name }
    $.post('/lists', { list })
      .done((data) => this.addNewList(data))
      .fail((response) => {
        responseJSON = JSON.parse(response.responseText)
        responseTextKeys = Object.keys(responseJSON);
        errors = []
        responseTextKeys.forEach((key) => {
          errorText = `${key} ${responseJSON[key]}`
          errors.push(errorText);
        });
        this.setState({ errors: errors.join(' and ') });
      });
  }

  addNewList(list) {
    const lists = React.addons.update(this.state.lists, { $push: [list] })
    this.setState({
      lists: lists.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      }),
      name: '',
      success: 'List successfully added.'
    })
  }

  handleDelete(listId) {
    if (confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${listId}`,
        type: 'DELETE',
        success: () => this.removeList(listId)
      })
    } else {
      return false;
    }
  }

  removeList(listId) {
    const lists = this.state.lists.filter((list) => {
      return list.id !== listId;
    })
    this.setState({lists});
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={ this.state.errors } alert_class="danger" />
      )
    } else if (this.state.success.length > 0) {
      return (
        <Alert text={ this.state.success } alert_class="success" />
      )
    }
  }

  render() {
    return (
      <div>
        { this.alert() }
        <ListForm name={ this.state.name }
                  onUserInput={ (object) => this.handleUserInput(object) }
                  onFormSubmit={ () =>  this.handleFormSubmit() } />
        <hr />
        <Lists lists={ this.state.lists }
               onListDelete={ (listId) => this.handleDelete(listId) } />
      </div>
    )
  }
}

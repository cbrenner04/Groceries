class ListsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: this.props.lists,
      name: ''
    }
  }

  handleUserInput(obj) {
    this.setState(obj);
  }

  handleFormSubmit() {
    const list = { name: this.state.name }
    $.post('/lists', { list: list }).done((data) => {
      this.addNewList(data);
    });
  }

  addNewList(list) {
    const lists = React.addons.update(this.state.lists, { $push: [list] })
    this.setState({
      lists: lists.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      }),
      name: ''
    })
  }

  handleDelete(listId) {
    $.ajax({
      url: `/lists/${listId}`,
      type: 'DELETE',
      success:() => {
        this.removeList(listId)
      }
    })
  }

  removeList(listId) {
    const lists = this.state.lists.filter((list) => {
      return list.id !== listId;
    })
    this.setState({lists});
  }

  render() {
    return (
      <div>
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

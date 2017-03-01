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

  render() {
    return (
      <div>
        <ListForm name={ this.state.name }
          onUserInput={ (object) => this.handleUserInput(object) }
          onFormSubmit={ () =>  this.handleFormSubmit() } />
        <hr />
        <Lists lists={ this.state.lists } />
      </div>
    )
  }
}

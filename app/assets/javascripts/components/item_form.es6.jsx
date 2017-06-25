class ItemForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: props.userId,
      list_id: props.listId,
      name: '',
      purchased: false,
      quantity: '',
      quantity_name: ''
    }
  }

  handleUserInput(event) {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit(event) {
    event.preventDefault();
    const item = {
      user_id: this.state.user_id,
      name: this.state.name,
      list_id: this.state.list_id,
      quantity: this.state.quantity,
      purchased: this.state.purchased,
      quantity_name: this.state.quantity_name
    }
    $.post('/items', { item: item }).done((data) => {
      this.props.handleItemAddition(data);
    });
    this.setState({
      name: '',
      purchased: false,
      quantity: '',
      quantity_name: ''
    });
  }

  // Typeahead stuff will need to be re-engineered once
  // upgrading to React is complete
  // var items = new Bloodhound({
  //   datumTokenizer: Bloodhound.tokenizers.whitespace,
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   remote: {
  //     url: '/items/autocomplete?name=%QUERY',
  //     wildcard: '%QUERY'
  //   }
  // });
  // $('#itemName').typeahead({
  //   hint: true,
  //   highlight: true,
  //   minLength: 1
  // }, {
  //   name: 'items',
  //   source: items
  // });

  render() {
    return (
      <form onSubmit={ (event) => this.handleSubmit(event) }>
        <input name="user_id"
               type="hidden"
               className="hidden"
               value={ this.state.userId } />
        <input name="list_id"
               type="hidden"
               className="hidden"
               value={ this.state.listId } />
        <input name="purchased"
               type="hidden"
               className="hidden"
               value={ this.state.purchased } />
        <div className="container-fluid">
          <div className="row">
            <div className="col-2" style={{padding: 0}}>
              <label className="sr-only" htmlFor="itemQuantity">Quantity</label>
              <input name="quantity"
                     type="number"
                     className="form-control"
                     id="itemQuantity"
                     value={ this.state.quantity }
                     onChange={ (event) => this.handleUserInput(event) }
                     placeholder="#"/>
            </div>
            <div className="col-3" style={{padding: 0}}>
              <label className="sr-only" htmlFor="itemQuantityName">
                Quantity Name
              </label>
              <input name="quantity_name"
                     type="text"
                     className="form-control"
                     id="itemQuantityName"
                     value={ this.state.quantity_name }
                     onChange={ (event) => this.handleUserInput(event) }
                     placeholder="type"/>
            </div>
            <div className="col-7" style={{padding: 0}}>
              <label className="sr-only" htmlFor="itemName">Item Name</label>
              <input name="name"
                     type="text"
                     className="form-control"
                     id="itemName"
                     value={ this.state.name }
                     onChange={ (event) => this.handleUserInput(event) }
                     placeholder="name"/>
            </div>
          </div>
        </div>
        <br />
        <input type="submit"
               value="Add New Item"
               className="btn btn-success btn-block action-button" />
      </form>
    )
  }
}

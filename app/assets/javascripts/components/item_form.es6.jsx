class ItemForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      listId: props.listId,
      name: '',
      purchased: false,
      quantity: '',
      quantityName: ''
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
      user_id: this.state.userId,
      name: this.state.name,
      list_id: this.state.listId,
      quantity: this.state.quantity,
      purchased: this.state.purchased,
      quantity_name: this.state.quantityName
    }
    $.post('/items', { item }).done((data) => {
      this.props.handleItemAddition(data);
    });
    this.setState({
      name: '',
      purchased: false,
      quantity: '',
      quantityName: ''
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
        { /* add alert for errors */ }
        <input name="userId"
               type="hidden"
               className="hidden"
               value={ this.state.userId } />
        <input name="listId"
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
                     className="form-control no-border-right"
                     id="itemQuantity"
                     value={ this.state.quantity }
                     onChange={ (event) => this.handleUserInput(event) }
                     placeholder="#"/>
            </div>
            <div className="col-3" style={{padding: 0}}>
              <label className="sr-only" htmlFor="itemQuantityName">
                Quantity Name
              </label>
              <input name="quantityName"
                     type="text"
                     className="form-control no-border-sides"
                     id="itemQuantityName"
                     value={ this.state.quantityName }
                     onChange={ (event) => this.handleUserInput(event) }
                     placeholder="type"/>
            </div>
            <div className="col-7" style={{padding: 0}}>
              <label className="sr-only" htmlFor="itemName">Item Name</label>
              <input name="name"
                     type="text"
                     className="form-control no-border-left"
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

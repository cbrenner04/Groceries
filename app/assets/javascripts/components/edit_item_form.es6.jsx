class EditItemForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: props.user.id,
      listId: props.list.id,
      name: props.item.name,
      purchased: false,
      quantity: props.item.quantity,
      quantityName: props.item.quantity_name
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
    $.ajax({
      url: `/items/${this.props.item.id}`,
      data: { item },
      method: "PUT"
    }).done(() => {
      window.location = `/lists/${this.props.list.id}`;
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
  // $('#item_name').typeahead({
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
        <div className="form-group" id="new-item">
          <label htmlFor="itemName">Item Name</label>
          <input name="name"
                 type="text"
                 className="form-control"
                 id="itemName"
                 value={ this.state.name }
                 onChange={ (event) => this.handleUserInput(event) } />
        </div>
        <div className="form-group" id="new-item">
          <label htmlFor="quantity">Quantity</label>
          <input name="quantity"
                 type="text"
                 className="form-control"
                 id="quantity"
                 value={ this.state.quantity }
                 onChange={ (event) => this.handleUserInput(event) } />
        </div>
        <div className="form-group" id="new-item">
          <label htmlFor="quantityName">Quantity Name</label>
          <input name="quantityName"
                 type="text"
                 className="form-control"
                 id="quantityName"
                 value={ this.state.quantityName }
                 onChange={ (event) => this.handleUserInput(event) } />
          <small className="help-block text-muted">
            This is meant to be used in conjunction with quantity. For example
            "1 bag" or "12 ounces".
          </small>
        </div>
        <input type="submit"
               value="Update Item"
               className="btn btn-success btn-block action-button" />
      </form>
    )
  }
}


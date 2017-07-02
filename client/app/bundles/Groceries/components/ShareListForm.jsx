import React, {Component} from 'react';

export default class ShareListForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      listId: this.props.list.id,
      users: this.props.users
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
    const users_list = {
      user_id: this.state.userId,
      list_id: this.state.listId
    }
    $.post(
      `/users_lists?list_id=${this.props.list.id}`,
      { users_list }
    ).done(() => {
      window.location = '/lists';
    });
  }

  render() {
    return(
      <form onSubmit={ (event) => this.handleSubmit(event) }>
        <div className="form-group">
          <label htmlFor="usersListUserId">
            Select who you would like to share this list with:
          </label>
          <select className="form-control"
                  name="userId"
                  id="usersListUserId"
                  value={ this.state.value }
                  onChange={ (event) => this.handleUserInput(event) }>
            <option value="">Please select</option>
            { this.props.users.map((user) => {
              return (
                <option key={ user.id } value={ user.id }>
                  { user.first_name }
                </option>
              )
            }) }
          </select>
        </div>
        <input type="submit"
               value="Share List"
               className="btn btn-success btn-block action-button" />
      </form>
    )
  }
}

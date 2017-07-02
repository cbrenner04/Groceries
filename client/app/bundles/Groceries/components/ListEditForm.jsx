import React, {Component} from 'react';

import Alert from './Alert';

export default class ListEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.list.name,
      errors: ''
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
    }).fail((response) => {
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

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={ this.state.errors } alert_class="danger" />
      )
    }
  }

  render() {
    return (
      <div>
        { this.alert() }
        <form className="form" onSubmit={ (event) => this.handleSubmit(event) }>
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
      </div>
    )
  }
}

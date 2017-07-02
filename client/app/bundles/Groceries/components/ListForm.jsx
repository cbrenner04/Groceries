import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ListForm extends Component {
  static propTypes ={
    name: PropTypes.string.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onUserInput: PropTypes.func.isRequired
  }

  handleChange = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.props.onUserInput(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onFormSubmit();
  }

  render() {
    return (
      <form className="form" onSubmit={ this.handleSubmit }>
        <div className="form-group">
          <input name="name"
                 className="form-control"
                 value={ this.props.name }
                 onChange={ this.handleChange }
                 placeholder="New list name"/>
        </div>
        <input type="submit"
               value="Create List"
               className="btn btn-success btn-block action-button"/>
      </form>
    )
  }
}

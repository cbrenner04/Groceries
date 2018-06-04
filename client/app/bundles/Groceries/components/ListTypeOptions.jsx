import React from 'react';
import PropTypes from 'prop-types';

const ListTypeOptions = props => (
  <div className="form-group">
    <label htmlFor="listType">Type</label>
    <select
      name="listType"
      className="form-control"
      id="listType"
      onChange={props.changeHandler}
      value={props.listType}
    >
      <option value="BookList">books</option>
      <option value="GroceryList">groceries</option>
      <option value="MusicList">music</option>
      <option value="ToDoList">to-do</option>
    </select>
  </div>
);

ListTypeOptions.propTypes = {
  listType: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

export default ListTypeOptions;

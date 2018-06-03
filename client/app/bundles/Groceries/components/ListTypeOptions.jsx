import React from 'react';
import PropTypes from 'prop-types';

import listIconClass from '../utils/list_icon';

const ListTypeOptions = props => (
  <div className="form-row ml-1 mb-3">
    {
      [
        { name: 'BookList', id: 1 },
        { name: 'GroceryList', id: 2 },
        { name: 'MusicList', id: 3 },
        { name: 'ToDoList', id: 4 },
      ].map(type => (
        <div className="form-check form-check-inline" key={type.id}>
          <input
            id={`listType-${type.name}`}
            type="radio"
            name="listType"
            value={type.name}
            checked={props.listType === type.name}
            onChange={props.changeHandler}
            className="form-check-input"
            aria-label={type.name}
          />
          <label className="form-check-label mr-1 ml-3" htmlFor={`listType-${type.name}`}>
            <i className={`fa ${listIconClass(type.name)} fa-2x text-primary`} />
          </label>
        </div>
      ))
    }
  </div>
);

ListTypeOptions.propTypes = {
  changeHandler: PropTypes.func.isRequired,
};

export default ListTypeOptions;

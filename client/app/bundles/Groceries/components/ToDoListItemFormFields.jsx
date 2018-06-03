import React from 'react';
import PropTypes from 'prop-types';

const EditToDoListItemFormFields = props => (
  <div>
    <div className="form-group">
      <label htmlFor="itemName">Name</label>
      <input
        name="itemName"
        type="text"
        className="form-control"
        id="itemName"
        value={props.itemName}
        onChange={props.inputHandler}
        placeholder="thing to do"
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemAssignee">Assignee</label>
      <select
        name="itemAssigneeId"
        className="form-control"
        id="itemAssignee"
        value={props.itemAssigneeId ? props.itemAssigneeId : ''}
        onChange={props.inputHandler}
      >
        <option value="" disabled>Select Assignee</option>
        {
          props.listUsers.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))
        }
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="itemDueDate">Due By</label>
      <input
        name="itemDueBy"
        type="date"
        className="form-control"
        id="itemDueDate"
        value={props.itemDueBy}
        onChange={props.inputHandler}
        placeholder="mm/dd/yyyy"
      />
    </div>
    {
      props.editForm && (
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            name="itemCompleted"
            id="itemCompleted"
            type="checkbox"
            checked={props.itemCompleted}
            onChange={props.inputHandler}
          />
          <label className="form-check-label" htmlFor="itemCompleted">
            Completed
          </label>
        </div>
      )
    }
  </div>
);

EditToDoListItemFormFields.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemAssigneeId: PropTypes.string.isRequired,
  itemDueBy: PropTypes.string.isRequired,
  itemCompleted: PropTypes.bool,
  listUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
    }),
  ).isRequired,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
};

EditToDoListItemFormFields.defaultProps = {
  itemCompleted: false,
  editForm: false,
};

export default EditToDoListItemFormFields;
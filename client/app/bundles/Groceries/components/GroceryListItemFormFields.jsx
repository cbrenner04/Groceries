import React from 'react';
import PropTypes from 'prop-types';

const EditGroceryListItemFormFields = props => (
  <div>
    <div className="form-group">
      <label htmlFor="itemName">Item Name</label>
      <input
        name="itemName"
        type="text"
        className="form-control"
        id="itemName"
        value={props.itemName}
        onChange={props.inputHandler}
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemQuantity">Quantity</label>
      <input
        name="itemQuantity"
        type="text"
        className="form-control"
        id="itemQuantity"
        value={props.itemQuantity}
        onChange={props.inputHandler}
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemQuantityName">Quantity Name</label>
      <input
        name="itemQuantityName"
        type="text"
        className="form-control"
        id="itemQuantityName"
        value={props.itemQuantityName}
        onChange={props.inputHandler}
      />
      <small className="help-block text-muted">
        This is meant to be used in conjunction with quantity. For example
        &quot;1 bag&quot; or &quot;12 ounces&quot;.
      </small>
    </div>
    {
      props.editForm && (
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            name="itemPurchased"
            id="itemPurchased"
            type="checkbox"
            checked={props.itemPurchased}
            onChange={props.inputHandler}
          />
          <label className="form-check-label" htmlFor="itemPurchased">
            Purchased
          </label>
        </div>
      )
    }
  </div>
);

EditGroceryListItemFormFields.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemQuantity: PropTypes.string.isRequired,
  itemQuantityName: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
};

EditGroceryListItemFormFields.defaultProps = {
  itemPurchased: false,
  editForm: false,
};

export default EditGroceryListItemFormFields;
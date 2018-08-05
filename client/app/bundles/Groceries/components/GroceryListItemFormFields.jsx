import React from 'react';
import PropTypes from 'prop-types';

const EditGroceryListItemFormFields = props => (
  <div>
    <div className="form-group">
      <label htmlFor="product">Product</label>
      <input
        name="product"
        type="text"
        className="form-control"
        id="product"
        value={props.product}
        onChange={props.inputHandler}
        placeholder="apples"
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
        placeholder="3 bags"
      />
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
  product: PropTypes.string.isRequired,
  itemQuantity: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
};

EditGroceryListItemFormFields.defaultProps = {
  itemPurchased: false,
  editForm: false,
};

export default EditGroceryListItemFormFields;

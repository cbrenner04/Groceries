import React from 'react';
import PropTypes from 'prop-types';

import Category from './Category';

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
    <Category category={props.category} categories={props.categories} handleInput={props.inputHandler} />
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
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
};

EditGroceryListItemFormFields.defaultProps = {
  itemPurchased: false,
  editForm: false,
  category: '',
  categories: [],
};

export default EditGroceryListItemFormFields;

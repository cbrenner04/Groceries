import React from 'react';
import PropTypes from 'prop-types';

import {
  CategoryField,
  TextField,
  CheckboxField,
} from './FormFields';

const EditGroceryListItemFormFields = props => (
  <div>
    <TextField
      name="product"
      label="Product"
      value={props.product}
      handleChange={props.inputHandler}
      placeholder="apples"
    />
    <TextField
      name="itemQuantity"
      label="Quantity"
      value={props.itemQuantity}
      handleChange={props.inputHandler}
      placeholder="3 bags"
    />
    <CategoryField category={props.category} categories={props.categories} handleInput={props.inputHandler} />
    {
      props.editForm && (
        <CheckboxField
          name="itemPurchased"
          label="Purchased"
          value={props.itemPurchased}
          handleChange={props.inputHandler}
          classes="mb-3"
        />
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

import React from 'react';
import PropTypes from 'prop-types';

import {
  CategoryField,
  TextField,
  NumberField,
  CheckboxField,
} from './FormFields';

const BookListItemFormFields = props => (
  <div>
    <TextField
      name="itemAuthor"
      label="Author"
      value={props.itemAuthor}
      handleChange={props.inputHandler}
      placeholder="Kurt Vonnagut"
    />
    <TextField
      name="itemTitle"
      label="Title"
      value={props.itemTitle}
      handleChange={props.inputHandler}
      placeholder="Slaughterhouse-Five"
    />
    <NumberField
      name="numberInSeries"
      label="Number in series"
      value={props.numberInSeries}
      handleChange={props.inputHandler}
    />
    <CategoryField category={props.category} categories={props.categories} handleInput={props.inputHandler} />
    {
      props.editForm && (
        <div className="form-row mb-3">
          <CheckboxField
            name="itemPurchased"
            label="Purchased"
            value={props.itemPurchased}
            handleChange={props.inputHandler}
            classes="form-check-inline ml-1"
          />
          <CheckboxField
            name="itemRead"
            label="Read"
            value={props.itemRead}
            handleChange={props.inputHandler}
            classes="form-check-inline"
          />
        </div>
      )
    }
  </div>
);

BookListItemFormFields.propTypes = {
  itemAuthor: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  itemRead: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
  numberInSeries: PropTypes.number,
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
};

BookListItemFormFields.defaultProps = {
  itemPurchased: false,
  itemRead: false,
  editForm: false,
  numberInSeries: 0,
  category: '',
  categories: [],
};

export default BookListItemFormFields;

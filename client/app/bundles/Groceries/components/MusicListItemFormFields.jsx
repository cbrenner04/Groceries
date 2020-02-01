import React from 'react';
import PropTypes from 'prop-types';

import { TextField, CategoryField, CheckboxField } from './FormFields';

const EditMusicListItemFormFields = props => (
  <div>
    <TextField
      name="itemTitle"
      label="Title"
      value={props.itemTitle}
      handleChange={props.inputHandler}
      placeholder="Baby Got Back"
    />
    <TextField
      name="itemArtist"
      label="Artist"
      value={props.itemArtist}
      handleChange={props.inputHandler}
      placeholder="Sir Mix-a-Lot"
    />
    <TextField
      name="itemAlbum"
      label="Album"
      value={props.itemAlbum}
      handleChange={props.inputHandler}
      placeholder="Mack Daddy"
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

EditMusicListItemFormFields.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  itemArtist: PropTypes.string.isRequired,
  itemAlbum: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
};

EditMusicListItemFormFields.defaultProps = {
  itemPurchased: false,
  editForm: false,
  category: '',
  categories: [],
};

export default EditMusicListItemFormFields;

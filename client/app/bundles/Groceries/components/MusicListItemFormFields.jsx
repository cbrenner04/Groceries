import React from 'react';
import PropTypes from 'prop-types';

const EditMusicListItemFormFields = props => (
  <div>
    <div className="form-group">
      <label htmlFor="itemTitle">Title</label>
      <input
        name="itemTitle"
        type="text"
        className="form-control"
        id="itemTitle"
        value={props.itemTitle}
        onChange={props.inputHandler}
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemArtist">Artist</label>
      <input
        name="itemArtist"
        type="text"
        className="form-control"
        id="itemArtist"
        value={props.itemArtist}
        onChange={props.inputHandler}
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemAlbum">Album</label>
      <input
        name="itemAlbum"
        type="text"
        className="form-control"
        id="itemAlbum"
        value={props.itemAlbum}
        onChange={props.inputHandler}
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

EditMusicListItemFormFields.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  itemArtist: PropTypes.string.isRequired,
  itemAlbum: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
};

EditMusicListItemFormFields.defaultProps = {
  itemPurchased: false,
  editForm: false,
};

export default EditMusicListItemFormFields;

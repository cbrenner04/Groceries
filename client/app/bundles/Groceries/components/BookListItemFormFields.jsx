import React from 'react';
import PropTypes from 'prop-types';

const EditBookListItemFormFields = props => (
  <div>
    <div className="form-group">
      <label htmlFor="itemAuthor">Author</label>
      <input
        name="itemAuthor"
        type="text"
        className="form-control"
        id="itemAuthor"
        value={props.itemAuthor}
        onChange={props.inputHandler}
        placeholder="Kurt Vonnegut"
      />
    </div>
    <div className="form-group">
      <label htmlFor="itemTitle">Title</label>
      <input
        name="itemTitle"
        type="text"
        className="form-control"
        id="itemTitle"
        value={props.itemTitle}
        onChange={props.inputHandler}
        placeholder="Slaughterhouse-Five"
      />
    </div>
    <div className="form-group">
      <label htmlFor="numberInSeries">Number in series</label>
      <input
        name="numberInSeries"
        type="number"
        className="form-control"
        id="numberInSeries"
        value={props.numberInSeries || ''}
        onChange={props.inputHandler}
      />
    </div>
    {
      props.editForm && (
        <div className="form-row mb-3">
          <div className="form-check form-check-inline ml-1">
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
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="itemRead"
              id="itemRead"
              type="checkbox"
              checked={props.itemRead}
              onChange={props.inputHandler}
            />
            <label className="form-check-label" htmlFor="itemRead">
              Read
            </label>
          </div>
        </div>
      )
    }
  </div>
);

EditBookListItemFormFields.propTypes = {
  itemAuthor: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  itemPurchased: PropTypes.bool,
  itemRead: PropTypes.bool,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
  numberInSeries: PropTypes.number,
};

EditBookListItemFormFields.defaultProps = {
  itemPurchased: false,
  itemRead: false,
  editForm: false,
  numberInSeries: 0,
};

export default EditBookListItemFormFields;

import React from 'react';
import PropTypes from 'prop-types';

function ReadIcon(props) {
  const handleRead = () => props.handleReadOfItem(props.item);
  const handleUnRead = () => props.handleUnReadOfItem(props.item);

  if (props.listType === 'BookList') {
    if (props.item.read) {
      return (
        <button onClick={handleUnRead} className="btn btn-link p-0 mr-3">
          <i className="fa fa-bookmark fa-2x text-info" />
        </button>
      );
    }
    return (
      <button onClick={handleRead} className="btn btn-link p-0 mr-3">
        <i className="fa fa-bookmark-o fa-2x text-info" />
      </button>
    );
  }
  return '';
}

ReadIcon.propTypes = {
  listType: PropTypes.string.isRequired,
  item: PropTypes.shape({
    read: PropTypes.bool,
  }).isRequired,
  handleReadOfItem: PropTypes.func,
  handleUnReadOfItem: PropTypes.func,
};

ReadIcon.defaultProps = {
  handleReadOfItem: () => {},
  handleUnReadOfItem: () => {},
};

export default ReadIcon;

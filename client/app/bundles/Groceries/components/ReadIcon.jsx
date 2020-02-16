import React from 'react';
import PropTypes from 'prop-types';

const ReadIcon = props => (
  <button onClick={props.itemRead ? props.handleUnRead : props.handleRead} className="btn btn-link p-0 mr-3">
    <i className={`fa fa-bookmark${props.itemRead ? '' : '-o'} fa-2x text-info`} />
  </button>
);

ReadIcon.propTypes = {
  itemRead: PropTypes.bool.isRequired,
  handleUnRead: PropTypes.func.isRequired,
  handleRead: PropTypes.func.isRequired,
};

export default ReadIcon;

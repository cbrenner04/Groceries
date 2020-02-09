import React from 'react';
import PropTypes from 'prop-types';

const EmailField = ({
  value,
  handleChange,
}) => (
  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      name="email"
      className="form-control"
      value={value}
      onChange={handleChange}
      placeholder="jane.smith@example.com"
    />
  </div>
);

EmailField.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default EmailField;

import React from 'react';
import PropTypes from 'prop-types';

const PasswordForm = props => (
  <form className="form" onSubmit={props.submissionHandler}>
    <div className="form-group">
      <input
        name="password"
        className="form-control"
        value={props.password}
        onChange={props.changeHandler}
        placeholder="New password"
        type="password"
        autoComplete="off"
      />
    </div>
    <div className="form-group">
      <input
        name="passwordConfirmation"
        className="form-control"
        value={props.passwordConfirmation}
        onChange={props.changeHandler}
        placeholder="Confirm new password"
        type="password"
        autoComplete="off"
      />
    </div>
    <button type="submit" className="btn btn-success btn-block">
      Set my password
    </button>
  </form>
);

PasswordForm.propTypes = {
  password: PropTypes.string.isRequired,
  passwordConfirmation: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submissionHandler: PropTypes.func.isRequired,
};

export default PasswordForm;

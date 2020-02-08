import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Alert from './Alert';
import PasswordField from './FormFields';

function EditInvite(props) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [invitationToken] = useState(queryString.parse(props.location.search).invitation_token);
  const [errors, setErrors] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors('');
    const user = {
      password,
      password_confirmation: passwordConfirmation,
      invitation_token: invitationToken,
    };
    $.ajax({
      url: '/users/invitation',
      data: { user },
      method: 'PUT',
    }).done(() => {
      // noop
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
      setErrors(responseErrors);
    });
  };

  return (
    <div>
      <Alert errors={errors} handleDismiss={() => setErrors('')} />
      <h2>Set your password</h2>
      <form className="form" onSubmit={handleSubmit}>
        <PasswordField
          name="password"
          label="password"
          value={password}
          handleChange={({ target: { value } }) => setPassword(value)}
          placeholder="New password"
        />
        <PasswordField
          name="passwordConfirmation"
          label="passwordConfirmation"
          value={passwordConfirmation}
          handleChange={({ target: { value } }) => setPasswordConfirmation(value)}
          placeholder="Confirm new password"
        />
        <button type="submit" className="btn btn-success btn-block">
          Set my password
        </button>
      </form>
    </div>
  );
}

EditInvite.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default EditInvite;

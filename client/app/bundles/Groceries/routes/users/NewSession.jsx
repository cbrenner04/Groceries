import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../../components/Alert';
import { CheckboxField, EmailField, PasswordField } from '../../components/FormFields';

export default function NewSession() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors('');
    const user = {
      email,
      password,
      remember_me: rememberMe,
    };
    $.post('/users/sign_in', { user }).done(() => {
      // noop
    }).fail((response) => {
      setErrors(response.responseText);
    });
  };

  return (
    <div>
      <Alert errors={errors} handleDismiss={() => setErrors('')} />
      <h2>Log in</h2>
      <form className="form" onSubmit={handleSubmit}>
        <EmailField value={email} handleChange={({ target: { value } }) => setEmail(value)} />
        <PasswordField
          name="password"
          label="Password"
          value={password}
          handleChange={({ target: { value } }) => setPassword(value)}
          placeholder="password"
        />
        <CheckboxField
          name="remember-me"
          classes="mb-3"
          label="Remember me"
          value={rememberMe}
          handleChange={() => setRememberMe(!rememberMe)}
        />
        <button type="submit" className="btn btn-success btn-block">
          Log in
        </button>
      </form>
      <Link to="/users/password/new">Forgot your password?</Link>
    </div>
  );
}

# frozen_string_literal: true

module Pages
  class Login < Page
    def email_input
      find("input[name='email']")
    end

    def password_input
      find("input[name='password']")
    end

    def password_confirmation_input
      find("input[name='passwordConfirmation']")
    end

    def submit_button
      find("input[type='submit']")
    end
  end
end

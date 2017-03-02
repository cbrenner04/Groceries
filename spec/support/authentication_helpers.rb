# frozen_string_literal: true
module AuthenticationHelpers
  def log_in_user(user)
    visit '/'
    fill_in "Email", with: user.email
    fill_in "Password", with: user.password
    click_on "Log in"
  end
end

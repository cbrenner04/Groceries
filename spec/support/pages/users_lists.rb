# frozen_string_literal: true

module Pages
  class UsersLists < Page
    def email_input
      find("#usersListNewEmail")
    end

    def submit_button
      find("input[type='submit']")
    end
  end
end

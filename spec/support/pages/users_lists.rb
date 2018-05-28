# frozen_string_literal: true

module Pages
  class UsersLists < Page
    def email_input
      find("#usersListNewEmail")
    end

    def submit_button
      find("button[type='submit']")
    end
  end
end

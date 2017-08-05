# frozen_string_literal: true

module Pages
  class UsersList < Page
    def select_user(user)
      find(".action-button", text: user).click
    end

    def invite_user(user)
      find("#usersListNewEmail").set user
    end

    def submit
      click_on "Share List"
    end
  end
end

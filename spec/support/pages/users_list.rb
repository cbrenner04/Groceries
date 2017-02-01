# frozen_string_literal: true
module Pages
  class UsersList < Page
    def select_user(user)
      select user, from: "Select who you would like to share this list with:"
    end

    def submit
      click_on "Submit"
    end
  end
end

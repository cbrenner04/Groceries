# frozen_string_literal: true

module Users
  # override sessions controller
  class PasswordsController < Devise::PasswordsController
    def new
      render template: "lists/index"
    end

    def edit
      render template: "lists/index"
    end
  end
end

# frozen_string_literal: true

module Users
  # override sessions controller
  class SessionsController < Devise::SessionsController
    def new
      render template: "lists/index"
    end
  end
end

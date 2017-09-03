# frozen_string_literal: true

module Users
  # override sessions controller
  class RegistrationsController < Devise::RegistrationsController
    def new
      render template: "lists/index"
    end
  end
end

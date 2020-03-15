# frozen_string_literal: true

# no doc
class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  # protect_from_forgery with: :null_session


  def route_not_found
    render template: "lists/index", status: :not_found
  end
end

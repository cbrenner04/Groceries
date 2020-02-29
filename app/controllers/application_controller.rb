# frozen_string_literal: true

# no doc
class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  def route_not_found
    render template: "lists/index", status: :not_found
  end
end

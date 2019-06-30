# frozen_string_literal: true

# no doc
class ListItemsController < ApplicationController
  before_action :require_list_access

  private

  def require_list_access
    list = List.find(params[:list_id])
    users_list = UsersList.find_by(list: list, user: current_user)
    return if users_list&.permissions == "write"

    redirect_to lists_path
  end
end

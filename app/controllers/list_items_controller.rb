# frozen_string_literal: true

# no doc
class ListItemsController < ProtectedRouteController
  before_action :require_list_access

  private

  # TODO: handle this differently
  def require_list_access
    list = List.find(params[:list_id])
    users_list = UsersList.find_by(list: list, user: current_user)
    return if users_list&.permissions == "write"

    head :forbidden
  end
end

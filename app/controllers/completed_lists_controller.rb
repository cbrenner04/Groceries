# frozen_string_literal: true

# Controller for completed lists
class CompletedListsController < ProtectedRouteController
  def index
    render json: { completed_lists: List.all_completed_lists(current_user) }
  end
end

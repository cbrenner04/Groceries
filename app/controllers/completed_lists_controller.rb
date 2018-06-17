# frozen_string_literal: true

# Controller for completed lists
class CompletedListsController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: {
          completed_lists: List.all_completed_lists(current_user)
        }
      end
    end
  end
end

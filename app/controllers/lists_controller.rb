# frozen_string_literal: true
# no doc
class ListsController < ApplicationController
  def index
    @lists = List.all
  end

  def new
    @list = List.new
  end

  def create
    @list = current_user.lists.build(list_params)

    @list.save ? redirect_to(lists_path) : render(:new)
  end

  private

  def list_params
    params.require(:list).permit(:user, :name)
  end
end

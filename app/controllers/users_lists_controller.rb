# frozen_string_literal: true

# no doc
class UsersListsController < ApplicationController
  before_action :set_list

  def new
    @users_list = UsersList.new
  end

  def create
    @users_list = UsersList.create(item_params)

    if @users_list.save
      redirect_to lists_path, notice: "Your list was successfully shared"
    else
      render :new
    end
  end

  private

  def item_params
    params.require(:users_list).permit(:user_id, :list_id)
  end

  def set_list
    @list = List.find(params[:list_id])
  end
end

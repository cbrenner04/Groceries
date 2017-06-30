# frozen_string_literal: true

# no doc
class UsersListsController < ApplicationController
  def new
    @list = List.find(params[:list_id])
    @users_list = UsersList.new
  end

  def create
    @list = List.find(params[:list_id])
    @users_list = UsersList.create(item_params)

    if @users_list.save
      render json: @users_list
    else
      render json: @users_list.errors, status: :unprocessable_entity
    end
  end

  private

  def item_params
    params.require(:users_list).permit(:user_id, :list_id)
  end
end

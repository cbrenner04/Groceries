# frozen_string_literal: true

# no doc
class UsersListsController < ApplicationController
  def index
    list = List.find(params[:list_id])
    invitable_users = current_user.users_that_list_can_be_shared_with(list)
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json do
        render json: { list: list, invitable_users: invitable_users,
                       accepted: accepted_users, pending: pending_users,
                       refused: refused_users }
      end
    end
  end

  def create
    @list = List.find(params[:list_id])
    @users_list = UsersList.create(users_list_params)

    if @users_list.save
      SharedListNotification
        .send_notification_for(current_user, users_list_params[:user_id])
      render json: @users_list
    else
      render json: @users_list.errors, status: :unprocessable_entity
    end
  end

  def update
    @users_list = UsersList.find(params[:id])
    begin
      @users_list.update(users_list_params)
      render json: @users_list
    rescue ArgumentError => error
      render json: error, status: :unprocessable_entity
    end
  end

  private

  def users_list_params
    params
      .require(:users_list)
      .permit(:user_id, :list_id, :has_accepted, :permissions)
  end

  def pending_users
    UsersList.where(list_id: params[:list_id]).pending.map do |user_list|
      { user: User.find(user_list.user_id), users_list: {
        id: user_list.id,
        permissions: user_list.permissions
      } }
    end
  end

  def accepted_users
    UsersList.where(list_id: params[:list_id]).accepted.map do |user_list|
      { user: User.find(user_list.user_id), users_list: {
        id: user_list.id,
        permissions: user_list.permissions
      } }
    end
  end

  def refused_users
    UsersList.where(list_id: params[:list_id]).refused.map do |user_list|
      { user: User.find(user_list.user_id), users_list: {
        id: user_list.id,
        permissions: user_list.permissions
      } }
    end
  end
end

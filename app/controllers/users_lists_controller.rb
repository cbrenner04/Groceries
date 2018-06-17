# frozen_string_literal: true

# no doc
class UsersListsController < ApplicationController
  def index
    accepted_users =
      UsersList.where(list_id: params[:list_id]).accepted.map do |user_list|
        User.find(user_list.user_id)
      end
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: { users: accepted_users } }
    end
  end

  def new
    list = List.find(params[:list_id])
    users = current_user.users_that_list_can_be_shared_with(list)
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: { list: list, users: users } }
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

  def accept_list
    set_users_list
    if @users_list
      @users_list.update!(has_accepted: true, responded: true)
      render json: @users_list
    else
      render json: { list: ["must exist", "can't be blank"] },
             status: :unprocessable_entity
    end
  end

  def reject_list
    set_users_list
    if @users_list
      @users_list.update!(responded: true)
      render json: @users_list
    else
      render json: { list: ["must exist", "can't be blank"] },
             status: :unprocessable_entity
    end
  end

  private

  def users_list_params
    params.require(:users_list).permit(:user_id, :list_id)
  end

  def set_users_list
    @users_list =
      UsersList.find_by(user_id: current_user.id, list_id: params[:list_id])
  end
end

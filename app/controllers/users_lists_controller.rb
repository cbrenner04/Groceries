# frozen_string_literal: true

# no doc
class UsersListsController < ApplicationController
  def new
    list = List.find(params[:list_id])
    users = current_user.related_users_through_lists.select do |user|
      User.unattached_to_list(list).include? user
    end
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
      render_json(@users_list.update!(has_accepted: true, responded: true))
    else
      render json: { list: ["must exist", "can't be blank"] },
             status: :unprocessable_entity
    end
  end

  def reject_list
    set_users_list
    if @users_list
      render_json(@users_list.update!(responded: true))
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

  def render_json(condition)
    if condition
      render json: @users_list
    else
      render json: @users_list.errors, status: :unprocessable_entity
    end
  end
end

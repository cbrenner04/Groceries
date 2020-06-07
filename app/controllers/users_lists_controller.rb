# frozen_string_literal: true

# no doc
# TODO: This needs a service object
class UsersListsController < ProtectedRouteController
  before_action :require_list_access, only: %i[index update]
  before_action :require_write_access, only: %i[create]

  def index
    render json: index_response
  end

  def show
    users_list = UsersList.find(params[:id])
    render json: users_list
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
    # the rescue here is in case a bad value is sent for `permissions`
    # `permissions` accepts `read` and `write` only
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

  # TODO: handle this differently
  def require_list_access
    list = List.find(params[:list_id])
    users_list = UsersList.find_by(list: list, user: current_user)
    return if users_list

    head :forbidden
  end

  # TODO: handle this differently
  # TODO: is this needed?
  def require_write_access
    list = List.find(params[:list_id])
    users_list = UsersList.find_by(list: list, user: current_user)
    return if users_list&.permissions == "write"

    head :forbidden
  end

  def index_response
    list = List.find(params[:list_id])
    user_is_owner = list.owner == current_user
    invitable_users = current_user.users_that_list_can_be_shared_with(list)
    {
      list: list, invitable_users: invitable_users,
      accepted: accepted_users, pending: pending_users,
      refused: refused_users, current_user_id: current_user.id,
      user_is_owner: user_is_owner
    }
  end

  def map_users(users_lists)
    users_lists.map do |user_list|
      {
        user: User.find(user_list.user_id),
        users_list: {
          id: user_list.id,
          permissions: user_list.permissions
        }
      }
    end
  end

  def list_users_by_status(status)
    users_lists = UsersList.where(list_id: params[:list_id]).public_send(status)
    map_users(users_lists)
  end

  def pending_users
    list_users_by_status "pending"
  end

  def accepted_users
    list_users_by_status "accepted"
  end

  def refused_users
    list_users_by_status "refused"
  end
end

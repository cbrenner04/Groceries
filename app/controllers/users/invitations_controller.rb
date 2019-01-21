# frozen_string_literal: true

module Users
  # override invitations controller
  class InvitationsController < Devise::InvitationsController
    # this overrides the default redirect after invitation is made
    # it needs to have the argument or an error would be thrown
    # rubocop:disable UnusedMethodArgument
    def after_invite_path_for(resource)
      list_id ? list_users_lists_path(list_id) : root_path
    end
    # rubocop:enable UnusedMethodArgument

    def new
      render "lists/index"
    end

    def create
      return super unless list_id
      new_user = User.find_by(email: params[:user][:email])
      if new_user && find_users_list(new_user)
        flash[:notice] = "List already shared with #{new_user.email}"
      elsif new_user
        create_users_list(new_user)
        flash[:notice] = "List has been shared with #{new_user.email}"
      else
        super { |user| create_users_list(user) if user.valid? }
      end
    end

    def edit
      render "lists/index"
    end

    private

    def list_id
      params[:list_id]
    end

    def find_users_list(user)
      UsersList.find_by(user_id: user.id, list_id: list_id)
    end

    def create_users_list(user)
      UsersList.create!(user_id: user.id, list_id: list_id)
      SharedListNotification.send_notification_for(current_user, user.id)
    end
  end
end

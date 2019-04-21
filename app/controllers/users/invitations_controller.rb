# frozen_string_literal: true

module Users
  # override invitations controller
  class InvitationsController < Devise::InvitationsController
    # this overrides the default redirect after invitation is made
    # it needs to have the argument or an error would be thrown
    def after_invite_path_for(_resource)
      list_id ? list_users_lists_path(list_id) : root_path
    end

    def new
      render "lists/index"
    end

    def create
      # do nothing if user already exists and this isn't related to list sharing
      return redirect_to root_path if invited_user && !list_id
      # if this isn't related to list sharing, just do regular invitation
      return super unless list_id
      # if the user exists, just create the users list
      if invited_user
        share_list(invited_user)
      else
        # if the user doesn't exist, do the inviting and create the users list
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

    def invited_user
      @invited_user ||= User.find_by(email: params[:user][:email])
    end

    def existing_users_list(user)
      UsersList.find_by(user_id: user.id, list_id: list_id)
    end

    def share_list(user)
      if existing_users_list(user)
        flash[:notice] = "List already shared with #{user.email}"
      else
        create_users_list(user)
        flash[:notice] = "List has been shared with #{user.email}"
      end
    end

    def create_users_list(user)
      UsersList.create!(user_id: user.id, list_id: list_id)
      SharedListNotification.send_notification_for(current_user, user.id)
    end
  end
end

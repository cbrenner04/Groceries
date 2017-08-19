# frozen_string_literal: true

module Users
  # override invitations controller
  class InvitationsController < Devise::InvitationsController
    def create
      return super unless list_id
      new_user = User.find_by(email: params[:user][:email])
      if new_user && find_users_list(new_user)
        flash_and_redirect("List already shared with #{new_user.email}")
      elsif new_user
        create_users_list(new_user)
        flash_and_redirect("List has been shared with #{new_user.email}")
      else
        super { |user| create_users_list(user) if user.valid? }
      end
    end

    private

    def list_id
      params[:list_id]
    end

    def find_users_list(user)
      UsersList.find_by(user_id: user.id, list_id: list_id)
    end

    def flash_and_redirect(flash_message)
      flash[:notice] = flash_message
      redirect_to new_users_list_path(list_id: list_id)
    end

    def create_users_list(user)
      UsersList.create!(user_id: user.id, list_id: list_id)
      SharedListNotification.send_notification_for(current_user, user.id)
    end
  end
end

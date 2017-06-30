# frozen_string_literal: true

# override Devise for creation
class RegistrationsController < Devise::RegistrationsController
  private

  def sign_up_params
    params
      .require(:user)
      .permit(:email, :first_name, :password, :password_confirmation)
  end
end

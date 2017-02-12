# frozen_string_literal: true
# override Devise for creation
class RegistrationsController < Devise::RegistrationsController
  # rubocop:disable AbcSize, MethodLength
  def create
    build_resource(registration_params)

    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
      elsif is_navigational_format?
        set_flash_message :notice,
                          :"signed_up_but_#{resource.inactive_message}"
      end
      respond_with resource, location: after_sign_up_path_for(resource)
    else
      clean_up_passwords
      respond_with resource
    end
  end
  # rubocop:enable AbcSize, MethodLength

  private

  def registration_params
    params
      .require(:user)
      .permit(:email, :first_name, :password, :password_confirmation)
  end
end

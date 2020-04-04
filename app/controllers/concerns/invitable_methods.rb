# frozen_string_literal: true

module InvitableMethods
  extend ActiveSupport::Concern

  # this is needed for the create method in users/invitations_controller.rb
  def resource_class(m = nil)
    if m
      mapping = Devise.mappings[m]
    else
      mapping = Devise.mappings[resource_name] || Devise.mappings.values.first
    end
    mapping.to
  end
end

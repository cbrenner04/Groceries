# frozen_string_literal: true

# Join model for Users and Lists
class UsersList < ApplicationRecord
  belongs_to :user
  belongs_to :list

  validates :user, :list, presence: true
  validates :user, uniqueness: { scope: :list }
end

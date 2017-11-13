# frozen_string_literal: true

# Join model for Users and Lists
class UsersList < ApplicationRecord
  belongs_to :user
  belongs_to :list

  validates :user, :list, presence: true
  validates :user, uniqueness: { scope: :list }
  validates :has_accepted, inclusion: { in: [true, false] }
  validates :responded, inclusion: { in: [true, false] }

  scope :accepted, (-> { where(has_accepted: true) })
end

# frozen_string_literal: true

# Join model for Users and Lists
class UsersList < ApplicationRecord
  belongs_to :user
  belongs_to :list

  enum permissions: { read: "read", write: "write" }

  validates :user, :list, presence: true
  validates :user, uniqueness: { scope: :list }

  scope :accepted, (-> { where(has_accepted: true) })

  before_destroy :no_to_do_list_assignments?

  def no_to_do_list_assignments?
    any_assignments = ToDoListItem.where(to_do_list: list).any? do |item|
      item.assignee_id == user.id
    end
    if any_assignments
      errors.add(:base, "Can't destroy due to ToDoListItem assignments")
    end
    !any_assignments
  end
end

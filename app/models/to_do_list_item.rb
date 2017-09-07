# frozen_string_literal: true

# no doc
class ToDoListItem < ApplicationRecord
  belongs_to :user
  belongs_to :to_do_list
  belongs_to :assignee, class_name: "User"
end

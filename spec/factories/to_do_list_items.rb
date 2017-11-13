# frozen_string_literal: true

FactoryGirl.define do
  factory :to_do_list_item do
    user
    to_do_list
    name "MyString"
    assignee_id nil
    due_by "2017-09-24 14:35:48"
    completed false
    refreshed false
    archived_at "2017-09-24 14:35:48"
  end
end

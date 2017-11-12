# frozen_string_literal: true

FactoryGirl.define do
  factory :to_do_list do
    sequence(:name) { |n| "MyString#{n}" }
    type "ToDoList"
  end
end
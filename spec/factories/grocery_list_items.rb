# frozen_string_literal: true

FactoryBot.define do
  factory :grocery_list_item do
    user
    grocery_list
    name "MyString"
    quantity 1
    purchased false
  end
end

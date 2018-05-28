# frozen_string_literal: true

FactoryBot.define do
  factory :grocery_list do
    sequence(:name) { |n| "MyString#{n}" }
    type "GroceryList"
  end
end

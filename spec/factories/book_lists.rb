# frozen_string_literal: true

FactoryBot.define do
  factory :book_list do
    sequence(:name) { |n| "MyString#{n}" }
    type "BookList"
  end
end

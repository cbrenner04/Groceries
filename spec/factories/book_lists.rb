# frozen_string_literal: true

FactoryGirl.define do
  factory :book_list do
    sequence(:name) { |n| "MyString#{n}" }
    type "BookList"
  end
end

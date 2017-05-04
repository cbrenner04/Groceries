# frozen_string_literal: true

FactoryGirl.define do
  factory :item do
    user
    list
    name "MyString"
    quantity 1
    purchased false
  end
end

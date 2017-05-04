# frozen_string_literal: true

FactoryGirl.define do
  factory :list do
    sequence(:name) { |n| "MyString#{n}" }
  end
end

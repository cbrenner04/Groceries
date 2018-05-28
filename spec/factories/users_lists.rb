# frozen_string_literal: true

FactoryGirl.define do
  factory :users_list do
    association :user
    association :list
    has_accepted true
    responded true
  end
end

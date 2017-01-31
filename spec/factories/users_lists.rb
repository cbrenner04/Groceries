# frozen_string_literal: true
FactoryGirl.define do
  factory :users_list do
    association :user
    association :list
  end
end

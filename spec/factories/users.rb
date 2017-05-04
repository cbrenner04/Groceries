# frozen_string_literal: true

FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "foo#{n}@bar.com" }
    password "foobar!"
    password_confirmation "foobar!"
    first_name "MyString"

    factory :user_with_lists do
      transient do
        lists_count 5
      end

      after(:create) do |user, evaluator|
        create_list(:users_list, evaluator.lists_count, user: user)
      end
    end
  end
end

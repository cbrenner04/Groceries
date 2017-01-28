# frozen_string_literal: true
FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "foo#{n}@bar.com" }
    password "foobar!"
    password_confirmation "foobar!"
    first_name "MyString"
  end
end

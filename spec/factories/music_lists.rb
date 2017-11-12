# frozen_string_literal: true

FactoryGirl.define do
  factory :music_list do
    sequence(:name) { |n| "MyString#{n}" }
    type "MusicyList"
  end
end

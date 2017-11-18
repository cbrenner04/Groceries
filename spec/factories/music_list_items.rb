# frozen_string_literal: true

FactoryGirl.define do
  factory :music_list_item do
    user
    music_list
    title "MyString"
    artist "MyString"
    album "MyString"
    purchased false
    archived_at nil
  end
end

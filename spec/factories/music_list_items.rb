# frozen_string_literal: true

FactoryGirl.define do
  factory :music_list_item do
    user nil
    music_list nil
    title "MyString"
    artist "MyString"
    album "MyString"
    purchased false
    archived_at "2017-09-24 14:35:40"
  end
end

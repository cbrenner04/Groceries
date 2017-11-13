# frozen_string_literal: true

FactoryGirl.define do
  factory :book_list_item do
    user
    book_list
    author "MyString"
    title "MyString"
    purchased false
    read false
    archived_at "2017-09-24 14:35:29"
  end
end

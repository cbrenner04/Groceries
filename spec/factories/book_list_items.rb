# frozen_string_literal: true

FactoryBot.define do
  factory :book_list_item do
    user
    book_list
    author "MyString"
    title "MyString"
    purchased false
    read false
    archived_at nil
  end
end

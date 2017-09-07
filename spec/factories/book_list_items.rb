# frozen_string_literal: true

FactoryGirl.define do
  factory :book_list_item do
    user nil
    book_lists nil
    author "MyString"
    title "MyString"
    purchase false
    read false
    archived_at "2017-09-24 14:35:29"
  end
end

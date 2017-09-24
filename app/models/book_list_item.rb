# frozen_string_literal: true

# no doc
class BookListItem < ApplicationRecord
  belongs_to :user
  belongs_to :book_list
end

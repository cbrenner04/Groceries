# frozen_string_literal: true

# no doc
class BookList < List
  has_many :book_list_items, dependent: :destroy
end

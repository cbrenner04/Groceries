# frozen_string_literal: true

# no doc
class BookList < List
  has_many :book_list_items, dependent: :destroy

  def categories
    book_list_items.map(&:category).concat(
      [
        "Action & adventure", "Autobiography", "Biography", "Crime", "Drama",
        "Fantasy", "Graphic novel", "Health", "Historical fiction", "History",
        "Horror", "Memoir", "Mystery", "Poetry", "Science", "Science fiction",
        "Self help", "Spirituality", "Textbook", "Thriller", "Thriller",
        "Travel", "True crime"
      ]
    ).uniq.compact.reject(&:empty?).sort
  end
end

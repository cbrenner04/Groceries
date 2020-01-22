class NormalizeCategories < ActiveRecord::Migration[5.2]
  def up
    BookListItem.all.each do |item|
      next unless item.category
      category = item.category.downcase
      item.update!(category: category)
    end
    GroceryListItem.all.each do |item|
      next unless item.category
      category = item.category.downcase
      item.update!(category: category)
    end
    MusicListItem.all.each do |item|
      next unless item.category
      category = item.category.downcase
      item.update!(category: category)
    end
    ToDoListItem.all.each do |item|
      next unless item.category
      category = item.category.downcase
      item.update!(category: category)
    end
  end

  # no doewn as it doesn't make any sense
end

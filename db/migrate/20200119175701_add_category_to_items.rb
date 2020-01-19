class AddCategoryToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :book_list_items, :category, :string
    add_column :grocery_list_items, :category, :string
    add_column :music_list_items, :category, :string
    add_column :to_do_list_items, :category, :string
  end
end

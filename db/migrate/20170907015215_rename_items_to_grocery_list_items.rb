class RenameItemsToGroceryListItems < ActiveRecord::Migration[5.0]
  def self.up
    remove_index :items, :list_id
    rename_column :items, :list_id, :grocery_list_id
    rename_table :items, :grocery_list_items
    add_index :grocery_list_items, :grocery_list_id
  end

  def self.down
    remove_index :grocery_list_items, :grocery_list_id
    rename_column :grocery_list_items, :grocery_list_id, :list_id
    rename_table :grocery_list_items, :items
    add_index :items, :list_id
  end
end

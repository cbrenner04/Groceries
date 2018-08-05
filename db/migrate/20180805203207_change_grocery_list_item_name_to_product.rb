class ChangeGroceryListItemNameToProduct < ActiveRecord::Migration[5.2]
  def change
    rename_column :grocery_list_items, :name, :product
  end
end

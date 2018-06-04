class RemoveQuantityNameFromGroceryListItem < ActiveRecord::Migration[5.0]
  def self.up
    change_column :grocery_list_items, :quantity, :string

    GroceryListItem.all.each do |item|
      new_quantity = "#{item.quantity} #{item.quantity_name}"
      item.update!(quantity: new_quantity)
    end

    remove_column :grocery_list_items, :quantity_name, :string
  end

  def self.down
    add_column :grocery_list_items, :quantity_name, :string
    change_column :grocery_list_items, :quantity, :integer
  end
end

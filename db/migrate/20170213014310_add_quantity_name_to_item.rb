class AddQuantityNameToItem < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :quantity_name, :string
  end
end

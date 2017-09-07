class AddTypeToLists < ActiveRecord::Migration[5.0]
  def change
    add_column :lists, :type, :string
    List.find_each { |list| list.update!(type: "GroceryList") }
  end
end

class MakeNameNotNullOnToDoListItem < ActiveRecord::Migration[5.0]
  def change
    change_column :to_do_list_items, :name, :string, null: false
  end
end

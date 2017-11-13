class RemoveAssigneeForeignKeyFromToDoListItem < ActiveRecord::Migration[5.0]
  def change
    remove_index :to_do_list_items, :assignee_id
  end
end

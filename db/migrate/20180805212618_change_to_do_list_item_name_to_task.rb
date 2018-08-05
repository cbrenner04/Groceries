class ChangeToDoListItemNameToTask < ActiveRecord::Migration[5.2]
  def change
    rename_column :to_do_list_items, :name, :task
  end
end

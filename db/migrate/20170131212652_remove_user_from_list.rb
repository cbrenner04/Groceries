class RemoveUserFromList < ActiveRecord::Migration[5.0]
  def change
    remove_column :lists, :user_id
  end
end

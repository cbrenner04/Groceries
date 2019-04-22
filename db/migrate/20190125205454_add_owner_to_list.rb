class AddOwnerToList < ActiveRecord::Migration[5.2]
  def up
    add_reference :lists, :owner, index: true, foreign_key: {to_table: :users}

    List.find_each do |list|
      owner = list.users_lists.order(:id).first.user
      list.update!(owner: owner)
    end

    change_column_null :lists, :owner_id, false
  end

  def down
    remove_reference :lists, :owner, index: true, foreign_key: {to_table: :users}
  end
end

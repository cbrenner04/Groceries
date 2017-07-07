class AddRespondedToUsersList < ActiveRecord::Migration[5.0]
  def change
    add_column :users_lists, :responded, :boolean

    UsersList.all.each { |list| list.update!(responded: true) }

    change_column :users_lists, :responded, :boolean, null: false, default: false
  end
end

class AddHasAcceptedToUsersList < ActiveRecord::Migration[5.0]
  def change
    add_column :users_lists, :has_accepted, :boolean

    UsersList.all.each { |list| list.update!(has_accepted: true) }

    change_column :users_lists, :has_accepted, :boolean, null: false, default: false
  end
end

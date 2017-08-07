class AddHasAcceptedToUsersList < ActiveRecord::Migration[5.0]
  def change
    add_column :users_lists, :has_accepted, :boolean

    UsersList.all.each do |list|
      list.has_accepted = true
      list.save(validate: false)
    end

    change_column :users_lists, :has_accepted, :boolean, null: false, default: false
  end
end

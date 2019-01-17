class AddPermissionsToUsersList < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      CREATE TYPE users_list_permissions AS ENUM ('write', 'read');
    SQL

    add_column :users_lists, :permissions, :users_list_permissions, default: 'write'

    UsersList.find_each do |user_list|
      user_list.update!(permissions: 'write')
    end
  end

  def down
    remove_column :users_lists, :permissions

    execute <<-SQL
      DROP TYPE users_list_permissions;
    SQL
  end
end

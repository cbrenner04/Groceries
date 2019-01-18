class AddPermissionsToUsersList < ActiveRecord::Migration[5.2]
  def up
    # execute <<-SQL
    #   CREATE TYPE users_list_permissions AS ENUM ('write', 'read');
    # SQL
    # add_column :users_lists, :permissions, :users_list_permissions, default: 'write'

    # The above is not support in active record schema dumps which is a pain
    # It would require dumping in sql which is manual and painful to merge
    # Removing the enum from the database means direct input in the database will not be type checked

    add_column :users_lists, :permissions, :string, default: 'write', null: false

    UsersList.find_each do |user_list|
      user_list.update!(permissions: 'write')
    end
  end

  def down
    remove_column :users_lists, :permissions

    # execute <<-SQL
    #   DROP TYPE users_list_permissions;
    # SQL
  end
end

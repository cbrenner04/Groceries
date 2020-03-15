class AddAllowPasswordChangeToUser < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :allow_password_change, :boolean, default: false, null: false

    User.reset_column_information
    User.find_each do |user|
      user.allow_password_change = false
    end
  end

  def down
    remove_column :users, :allow_password_change
  end
end

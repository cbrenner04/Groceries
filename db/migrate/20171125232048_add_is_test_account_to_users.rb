class AddIsTestAccountToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :is_test_account, :boolean, default: false
  end
end

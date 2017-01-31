class CreateUsersLists < ActiveRecord::Migration[5.0]
  def change
    create_table :users_lists do |t|
      t.integer :user_id, null: false
      t.integer :list_id, null: false
    end

    add_index :users_lists, :user_id
    add_index :users_lists, :list_id
    add_index(:users_lists, [:user_id, :list_id], unique: true)
  end
end

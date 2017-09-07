class CreateToDoListItems < ActiveRecord::Migration[5.0]
  def change
    create_table :to_do_list_items do |t|
      t.references :user, foreign_key: true, null: false
      t.references :lists, foreign_key: true, null: false
      t.string :name
      t.references :assignee
      t.datetime :due_by
      t.boolean :completed, null: false, default: false
      t.boolean :refreshed, null: false, default: false
      t.datetime :archived_at

      t.timestamps
    end

    add_foreign_key :to_do_list_items, :users, column: :assignee_id, primary_key: :id
  end

  def self.up
    remove_index :to_do_list_items, :list_id
    rename_column :to_do_list_items, :list_id, :to_do_list_id
    add_index :to_do_list_items, :to_do_list_id
  end

  def self.down
    remove_index :to_do_list_items, :to_do_list_id
    rename_column :to_do_list_items, :to_do_list_id, :list_id
    add_index :to_do_list_items, :list_id
  end
end

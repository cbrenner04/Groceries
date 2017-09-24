class CreateBookListItems < ActiveRecord::Migration[5.0]
  def change
    create_table :book_list_items do |t|
      t.references :user, foreign_key: true, null: false
      t.references :lists, foreign_key: true, null: false
      t.string :author
      t.string :title
      t.boolean :purchase, null: false, default: false
      t.boolean :read, null: false, default: false
      t.datetime :archived_at

      t.timestamps
    end
  end

  def self.up
    remove_index :book_list_items, :list_id
    rename_column :book_list_items, :list_id, :book_list_id
    add_index :book_list_items, :book_list_id
  end

  def self.down
    remove_index :book_list_items, :book_list_id
    rename_column :book_list_items, :book_list_id, :list_id
    add_index :book_list_items, :list_id
  end
end

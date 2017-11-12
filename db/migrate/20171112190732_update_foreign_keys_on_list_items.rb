class UpdateForeignKeysOnListItems < ActiveRecord::Migration[5.0]
  def self.up
    remove_index :book_list_items, :lists_id
    rename_column :book_list_items, :lists_id, :book_list_id
    add_index :book_list_items, :book_list_id
    remove_index :music_list_items, :lists_id
    rename_column :music_list_items, :lists_id, :music_list_id
    add_index :music_list_items, :music_list_id
    remove_index :to_do_list_items, :lists_id
    rename_column :to_do_list_items, :lists_id, :to_do_list_id
    add_index :to_do_list_items, :to_do_list_id
  end

  def self.down
    remove_index :book_list_items, :book_list_id
    rename_column :book_list_items, :book_list_id, :lists_id
    add_index :book_list_items, :lists_id
    remove_index :music_list_items, :music_list_id
    rename_column :music_list_items, :music_list_id, :lists_id
    add_index :music_list_items, :lists_id
    remove_index :to_do_list_items, :to_do_list_id
    rename_column :to_do_list_items, :to_do_list_id, :lists_id
    add_index :to_do_list_items, :lists_id
  end
end

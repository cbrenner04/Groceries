class CreateMusicListItems < ActiveRecord::Migration[5.0]
  def change
    create_table :music_list_items do |t|
      t.references :user, foreign_key: true, null: false
      t.references :lists, foreign_key: true, null: false
      t.string :title
      t.string :artist
      t.string :album
      t.boolean :purchased, null: false, default: false
      t.datetime :archived_at

      t.timestamps
    end
  end

  def self.up
    remove_index :music_list_items, :list_id
    rename_column :music_list_items, :list_id, :music_list_id
    add_index :music_list_items, :music_list_id
  end

  def self.down
    remove_index :music_list_items, :music_list_id
    rename_column :music_list_items, :music_list_id, :list_id
    add_index :music_list_items, :list_id
  end
end

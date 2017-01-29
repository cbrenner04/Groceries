class CreateItems < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.references :user, foreign_key: true, null: false
      t.references :list, foreign_key: true, null: false
      t.string :name, null: false
      t.integer :quantity, default: 1, null: false
      t.boolean :purchased, default: false, null: false

      t.timestamps
    end
  end
end

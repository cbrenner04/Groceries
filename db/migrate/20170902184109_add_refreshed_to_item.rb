class AddRefreshedToItem < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :refreshed, :boolean

    Item.all.each { |list| list.update!(refreshed: false) }

    change_column :items, :refreshed, :boolean, null: false, default: false
  end
end

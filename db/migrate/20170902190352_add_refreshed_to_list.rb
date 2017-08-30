class AddRefreshedToList < ActiveRecord::Migration[5.0]
  def change
    add_column :lists, :refreshed, :boolean

    List.all.each { |list| list.update!(refreshed: false) }

    change_column :lists, :refreshed, :boolean, null: false, default: false
  end
end

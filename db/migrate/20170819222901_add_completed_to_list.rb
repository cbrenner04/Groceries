class AddCompletedToList < ActiveRecord::Migration[5.0]
  def change
    add_column :lists, :completed, :boolean

    List.all.each { |list| list.update!(completed: false) }

    change_column :lists, :completed, :boolean, null: false, default: false
  end
end

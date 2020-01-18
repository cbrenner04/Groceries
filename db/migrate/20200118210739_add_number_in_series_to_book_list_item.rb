class AddNumberInSeriesToBookListItem < ActiveRecord::Migration[5.2]
  def change
    add_column :book_list_items, :number_in_series, :integer
  end
end

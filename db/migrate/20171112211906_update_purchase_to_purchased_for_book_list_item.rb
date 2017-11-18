class UpdatePurchaseToPurchasedForBookListItem < ActiveRecord::Migration[5.0]
  def change
    rename_column :book_list_items, :purchase, :purchased
  end
end

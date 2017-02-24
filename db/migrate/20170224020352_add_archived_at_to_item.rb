class AddArchivedAtToItem < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :archived_at, :datetime
  end
end

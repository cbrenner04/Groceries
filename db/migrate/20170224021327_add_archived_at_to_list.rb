class AddArchivedAtToList < ActiveRecord::Migration[5.0]
  def change
    add_column :lists, :archived_at, :datetime
  end
end

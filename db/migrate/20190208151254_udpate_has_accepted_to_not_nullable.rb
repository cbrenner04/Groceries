class UdpateHasAcceptedToNotNullable < ActiveRecord::Migration[5.2]
  def change
    UsersList.where(has_accepted: nil).update_all(has_accepted: false)
    change_column :users_lists, :has_accepted, :boolean, null: false, default: false
  end
end

class SimplifyAcceptedLogic < ActiveRecord::Migration[5.2]
  def up
    change_column :users_lists, :has_accepted, :boolean, null: true, default: nil

    UsersList.find_each do |user_list|
      if !user_list.has_accepted && !user_list.responded
        user_list.update!(has_accepted: nil)
      end
    end

    remove_column :users_lists, :responded
  end

  def down
    add_column :users_lists, :responded, :boolean, null: false

    UsersList.find_each do |user_list|
      if user_list.has_accepted == nil
        user_list.update!(has_accepted: false, responded: false)
      end

      if user_list.has_accepted == false
        user_list.update!(responded: true)
      end
    end

    change_column :users_lists, :has_accepted, :boolean, null: false
  end
end

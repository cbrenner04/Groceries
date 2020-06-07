# frozen_string_literal: true

# service object for UsersLists
class UsersListsService
  def initialize(list_id)
    @list_id = list_id
  end

  def list_users_by_status(status)
    users_lists = UsersList.where(list_id: @list_id).public_send(status)
    users_lists.map do |user_list|
      {
        user: User.find(user_list.user_id),
        users_list: {
          id: user_list.id,
          permissions: user_list.permissions
        }
      }
    end
  end

  def list_users
    accepted_users_lists = UsersList.where(list_id: @list_id).public_send("accepted")
    pending_users_lists = UsersList.where(list_id: @list_id).public_send("pending")
    accepted_users_lists.to_a.concat(pending_users_lists.to_a).map do |user_list|
      User.find(user_list.user_id)
    end
  end
end

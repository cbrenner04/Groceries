# frozen_string_literal: true

# no doc
class List < ApplicationRecord
  has_many :users_lists, dependent: :destroy
  has_many :users, through: :users_lists, source: :user, dependent: :destroy

  scope :descending, (-> { order(created_at: :desc) })
  scope :not_archived, (-> { where(archived_at: nil) })
  scope :not_refreshed, (-> { where(refreshed: false) })

  validates :name, presence: true

  def archive
    update archived_at: Time.zone.now
  end

  def as_json(options = {})
    super(options.merge(methods: :type))
  end

  def self.accepted(user)
    not_completed_lists =
      List.find_by_sql(not_completed_accepted_lists_query(user.id))
    completed_lists =
      List.find_by_sql(limited_completed_accepted_lists_query(user.id))
    not_completed_lists.concat(completed_lists)
  end

  def self.all_completed_lists(user)
    List.find_by_sql(completed_accepted_lists_query(user.id))
  end

  def self.not_accepted(user)
    List.find_by_sql(not_accepted_lists_query(user.id))
  end

  def self.not_completed_accepted_lists_query(user_id)
    <<-SQL
      SELECT lists.id, lists.name, lists.created_at, lists.completed,
             lists.type, lists.refreshed
      FROM lists
      INNER JOIN users_lists
              ON lists.id = users_lists.list_id
      WHERE users_lists.user_id = #{user_id}
      AND users_lists.has_accepted = true
      AND lists.archived_at IS NULL
      AND lists.completed = false
      ORDER BY lists.created_at DESC;
    SQL
  end

  def self.completed_accepted_lists_query(user_id)
    <<-SQL
      SELECT lists.id, lists.name, lists.created_at, lists.completed,
             lists.type, lists.refreshed
      FROM lists
      INNER JOIN users_lists
              ON lists.id = users_lists.list_id
      WHERE users_lists.user_id = #{user_id}
      AND users_lists.has_accepted = true
      AND lists.archived_at IS NULL
      AND lists.completed = true
      ORDER BY lists.created_at DESC;
    SQL
  end

  def self.limited_completed_accepted_lists_query(user_id)
    <<-SQL
      SELECT lists.id, lists.name, lists.created_at, lists.completed,
             lists.type, lists.refreshed
      FROM lists
      INNER JOIN users_lists
              ON lists.id = users_lists.list_id
      WHERE users_lists.user_id = #{user_id}
      AND users_lists.has_accepted = true
      AND lists.archived_at IS NULL
      AND lists.completed = true
      ORDER BY lists.created_at DESC
      LIMIT 10;
    SQL
  end

  def self.not_accepted_lists_query(user_id)
    <<-SQL
      SELECT lists.id, lists.name, lists.created_at, lists.completed,
             lists.type, lists.refreshed, users_lists.id as users_list_id
      FROM lists
      INNER JOIN users_lists
              ON lists.id = users_lists.list_id
      WHERE users_lists.user_id = #{user_id}
      AND users_lists.has_accepted IS NULL
      AND lists.archived_at IS NULL
      ORDER BY lists.created_at DESC;
    SQL
  end
end

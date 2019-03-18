# frozen_string_literal: true

# no doc
class List < ApplicationRecord
  has_many :users_lists, dependent: :destroy
  has_many :users, through: :users_lists, source: :user, dependent: :destroy
  belongs_to :owner, class_name: "User", inverse_of: :lists

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

  def self.accepted_lists_query(user_id)
    <<-SQL
      SELECT *
      FROM active_lists
      WHERE user_id = #{user_id}
      AND has_accepted = true
    SQL
  end

  def self.not_accepted_lists_query(user_id)
    <<-SQL
      SELECT *
      FROM active_lists
      WHERE user_id = #{user_id}
      AND has_accepted IS NULL
      OR has_accepted = false
    SQL
  end

  def self.completed_accepted_lists_query(user_id)
    "#{accepted_lists_query(user_id)} AND completed = true"
  end

  def self.limited_completed_accepted_lists_query(user_id)
    "#{completed_accepted_lists_query(user_id)} LIMIT 10"
  end

  def self.not_completed_accepted_lists_query(user_id)
    "#{accepted_lists_query(user_id)} AND completed = false"
  end
end

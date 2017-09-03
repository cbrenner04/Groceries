# frozen_string_literal: true

# no doc
class List < ApplicationRecord
  has_many :users_lists, dependent: :destroy
  has_many :users, through: :users_lists, source: :user, dependent: :destroy
  has_many :items, dependent: :destroy

  scope :descending, (-> { order(created_at: :desc) })
  scope :not_archived, (-> { where(archived_at: nil) })
  scope :not_refreshed, (-> { where(refreshed: false) })

  validates :name, presence: true

  def archive
    update archived_at: Time.zone.now
  end

  def self.accepted(user)
    not_archived.descending.map do |list|
      next unless UsersList.find_by(user: user, list: list)&.has_accepted
      list
    end.reject(&:blank?)
  end

  def self.not_accepted(user)
    not_archived.descending.map do |list|
      users_list = UsersList.find_by(user: user, list: list)
      next if users_list&.has_accepted || users_list&.responded
      list
    end.reject(&:blank?)
  end
end

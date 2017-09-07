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

  def self.accepted(user)
    not_archived.descending.select do |list|
      UsersList.find_by(user: user, list: list)&.has_accepted
    end
  end

  def self.not_accepted(user)
    not_archived.descending.reject do |list|
      users_list = UsersList.find_by(user: user, list: list)
      users_list&.has_accepted || users_list&.responded
    end
  end
end

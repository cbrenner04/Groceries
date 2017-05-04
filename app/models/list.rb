# frozen_string_literal: true

# no doc
class List < ApplicationRecord
  has_many :users_lists, dependent: :destroy
  has_many :users, through: :users_lists, source: :user, dependent: :destroy
  has_many :items, dependent: :destroy

  scope :descending, (-> { order(created_at: :desc) })
  scope :not_archived, (-> { where(archived_at: nil) })

  validates :name, presence: true

  def archive
    update archived_at: Time.zone.now
  end
end

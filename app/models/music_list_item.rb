# frozen_string_literal: true

# no doc
class MusicListItem < ApplicationRecord
  belongs_to :user
  belongs_to :music_list

  scope :not_purchased, (-> { where(purchased: false) })
  scope :purchased, (-> { where(purchased: true) })
  scope :not_archived, (-> { where(archived_at: nil) })

  validates :user, :music_list, presence: true
  validates :purchased, inclusion: { in: [true, false] }

  def self.ordered
    all.order(:created_at)
  end

  def archive
    update archived_at: Time.zone.now
  end
end

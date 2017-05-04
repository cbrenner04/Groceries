# frozen_string_literal: true

# no doc
class Item < ApplicationRecord
  searchkick word_start: %w[name]

  belongs_to :user
  belongs_to :list

  scope :not_purchased, (-> { where(purchased: false) })
  scope :purchased, (-> { where(purchased: true) })
  scope :not_archived, (-> { where(archived_at: nil) })

  validates :user, :list, :name, :quantity, presence: true
  validates :purchased, inclusion: { in: [true, false] }

  def self.ordered
    all.order(:name)
  end

  def self.unique_names
    ordered.select(:name).distinct
  end

  def archive
    update archived_at: Time.zone.now
  end
end

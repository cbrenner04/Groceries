# frozen_string_literal: true
# no doc
class List < ApplicationRecord
  has_many :users_lists, dependent: :destroy
  has_many :users, through: :users_lists, source: :user, dependent: :destroy
  has_many :items, dependent: :destroy

  scope :descending, -> { order(created_at: :desc) }

  validates :name, presence: true
end

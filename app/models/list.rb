# frozen_string_literal: true
# no doc
class List < ApplicationRecord
  belongs_to :user
  has_many :items, dependent: :destroy

  scope :descending, -> { order(created_at: :desc) }

  validates :user, :name, presence: true
end

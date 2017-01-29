# frozen_string_literal: true
# no doc
class Item < ApplicationRecord
  belongs_to :user
  belongs_to :list

  scope :not_purchased, -> { where(purchased: false) }
  scope :purchased, -> { where(purchased: true) }

  validates :user, :list, :name, :quantity, presence: true
  validates :purchased, inclusion: { in: [true, false] }
end

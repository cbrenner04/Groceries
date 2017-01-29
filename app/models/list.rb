# frozen_string_literal: true
# no doc
class List < ApplicationRecord
  belongs_to :user
  has_many :items

  validates :user, :name, presence: true
end

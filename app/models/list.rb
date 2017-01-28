# frozen_string_literal: true
# no doc
class List < ApplicationRecord
  belongs_to :user
  validates :user, :name, presence: true
end

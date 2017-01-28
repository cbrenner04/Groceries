# frozen_string_literal: true
# no doc
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :lists, dependent: :destroy
  validates :email, :first_name, presence: true
end

# frozen_string_literal: true

# no doc
class User < ApplicationRecord
  # TODO: remove registerable/validatable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :users_lists, dependent: :destroy
  has_many :lists, through: :users_lists, source: :list, dependent: :destroy
  has_many :items, through: :lists, dependent: :destroy

  validates :email, :first_name, presence: true

  def self.unattached_to_list(list)
    users = UsersList.all.where(list_id: list.id).map(&:user_id)
    User.where.not(id: users)
  end
end

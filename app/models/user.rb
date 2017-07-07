# frozen_string_literal: true

# no doc
class User < ApplicationRecord
  devise :invitable, :database_authenticatable, :registerable, :recoverable,
         :rememberable, :trackable, :invitable, invite_for: 1.week

  has_many :users_lists, dependent: :destroy
  has_many :lists, through: :users_lists, source: :list, dependent: :destroy
  has_many :items, through: :lists, dependent: :destroy
  has_many :invitations, class_name: to_s, as: :invited_by

  validates :email, presence: true

  def self.unattached_to_list(list)
    users = UsersList.all.where(list_id: list.id).map(&:user_id)
    User.where.not(id: users)
  end

  def related_users_through_lists
    lists.map(&:users_lists).flatten.uniq.map do |user_list|
      next if user_list.user_id == id || !user_list.has_accepted
      User.find(user_list.user_id)
    end.uniq.reject(&:blank?)
  end
end

# frozen_string_literal: true

# no doc
class User < ApplicationRecord
  devise :invitable, :database_authenticatable, :recoverable,
         :rememberable, :trackable, :invitable, invite_for: 1.week

  has_many :users_lists, dependent: :destroy
  has_many :lists,
           through: :users_lists,
           source: :list,
           dependent: :restrict_with_exception
  has_many :invitations,
           class_name: to_s,
           as: :invited_by,
           dependent: :restrict_with_exception
  has_many :book_list_items, dependent: :restrict_with_exception
  has_many :grocery_list_items, dependent: :restrict_with_exception
  has_many :music_list_items, dependent: :restrict_with_exception
  has_many :to_do_list_items, dependent: :restrict_with_exception

  validates :email, presence: true

  def self.unattached_to_list(list)
    users = UsersList.all.where(list_id: list.id).map(&:user_id)
    User.where.not(id: users)
  end

  def related_users_through_lists
    user_lists = lists.map(&:users_lists).flatten.uniq.reject do |user_list|
      user_list.user_id == id || !user_list.has_accepted
    end
    user_lists.map { |user_list| User.find(user_list.user_id) }.uniq
  end
end

# frozen_string_literal: true

# no doc
class User < ApplicationRecord
  devise :invitable, :database_authenticatable, :recoverable,
         :rememberable, :trackable, :invitable, invite_for: 1.week
  include DeviseTokenAuth::Concerns::User

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

  def users_that_list_can_be_shared_with(list)
    User.find_by_sql(related_users_query(list.id))
  end

  private

  # TODO: What attributes are needed here? shouldn't be returning *
  # Find users where they have been shared on the same lists as current user
  # Filter out usere that are already shared on the supplied list
  def related_users_query(list_id)
    <<-SQL
      SELECT DISTINCT "users".*
      FROM "users"
      INNER JOIN "users_lists"
              ON "users"."id" = "users_lists"."user_id"
      WHERE "users_lists"."list_id" IN (
        SELECT "lists"."id"
        FROM "lists"
        INNER JOIN "users_lists"
                ON "lists"."id" = "users_lists"."list_id"
        WHERE "users_lists"."user_id" = #{id}
      )
      AND NOT "users"."id" IN (
        SELECT "users_lists"."user_id"
        FROM "users_lists"
        WHERE "users_lists"."list_id" = #{list_id}
      );
    SQL
  end
end

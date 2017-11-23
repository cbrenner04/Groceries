# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  let(:user) { create :user }
  let(:list) { create :grocery_list }

  describe "validations" do
    it { expect(user).to be_valid }

    it "is invalid without email" do
      user.email = nil

      expect(user).to_not be_valid
    end
  end

  describe ".unattached_to_list" do
    it "returns all users not attached to list" do
      expect(User.unattached_to_list(list).count).to eq User.count
    end
  end

  describe "#related_users_through_lists" do
    before do
      new_user = User.create!(email: "test@test.org")
      UsersList.create!(
        user: new_user,
        list: list,
        has_accepted: true,
        responded: true
      )
      UsersList.create!(
        user: user,
        list: list,
        has_accepted: true,
        responded: true
      )
    end

    it "return all users related to current user through shared lists" do
      expect(user.related_users_through_lists.count).to eq 1
    end
  end
end

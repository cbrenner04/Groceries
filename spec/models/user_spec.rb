# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  let(:user) { create :user }
  let(:list) { create :grocery_list, owner: user }
  let(:other_list) { create :grocery_list, owner: user }

  describe "validations" do
    it { expect(user).to be_valid }

    it "is invalid without email" do
      user.email = nil

      expect(user).to_not be_valid
    end
  end

  describe "#users_that_list_can_be_shared_with" do
    before do
      new_user = User.create!(email: "test@test.org")
      UsersList.create!(user: new_user, list: list, has_accepted: true)
      UsersList.create!(user: user, list: list, has_accepted: true)
      UsersList.create!(user: user, list: other_list, has_accepted: true)
    end

    it "return all users related to current user through shared lists" do
      expect(user.users_that_list_can_be_shared_with(other_list).count).to eq 1
    end
  end
end

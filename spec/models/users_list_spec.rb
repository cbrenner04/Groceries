# frozen_string_literal: true

require "rails_helper"

RSpec.describe UsersList do
  describe "validations" do
    let(:users_list) { create :users_list }
    let(:second_list) { create :users_list }

    it { expect(users_list).to be_valid }

    it "is invalid without user" do
      users_list.user = nil

      expect(users_list).to_not be_valid
    end

    it "is invalid without list" do
      users_list.list = nil

      expect(users_list).to_not be_valid
    end

    it "is invalid if user and list combination is not unique" do
      second_list.user = users_list.user
      second_list.list = users_list.list

      expect(second_list).to_not be_valid
    end
  end

  describe "#no_to_do_list_assignments?" do
    let(:user) { create :user }
    let(:other_user) { create :user }
    let(:list) { create :to_do_list }
    let(:users_list) { create :users_list, user: user, list: list }
    let(:other_users_list) { create :users_list, user: other_user, list: list }
    let!(:to_do_list_item) do
      create :to_do_list_item,
             user: user,
             to_do_list: list,
             assignee_id: other_user.id
    end

    it "return false when to do list assignments exist" do
      expect(other_users_list.no_to_do_list_assignments?)
        .to eq false
    end
  end
end

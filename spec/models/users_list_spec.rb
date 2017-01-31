# frozen_string_literal: true
require "rails_helper"

RSpec.describe UsersList, type: :model do
  describe "validations" do
    let(:users_list) { create :users_list }
    let(:second_list) { create :users_list }

    it "is valid" do
      expect(users_list).to be_valid
    end

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
end

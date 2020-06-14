# frozen_string_literal: true

require "rails_helper"

RSpec.describe List do
  let(:user) { create :user }
  let(:list) { create :grocery_list, owner: user }
  let(:other_list) { create :grocery_list, owner: user }

  describe "validations" do
    it { expect(list).to be_valid }

    it "is invalid without name" do
      list.name = nil

      expect(list).not_to be_valid
    end
  end

  describe "#archive" do
    it "updates archived_at" do
      expect do
        list.archive
      end.to change(list, :archived_at)
    end
  end

  describe "#as_json" do
    it "returns list as json with type" do
      expect(list.as_json["type"]).not_to be_blank
    end
  end

  describe ".accepted" do
    let(:user) { create :user }

    before do
      UsersList.create!(user: user, list: other_list, has_accepted: true)
    end

    it "returns lists accepted by user" do
      expect(described_class.accepted(user)[:not_completed_lists].count).to eq 1
      expect(described_class.accepted(user)[:completed_lists].count).to eq 0
    end
  end

  describe ".pending" do
    let(:new_user) { create :user }

    before do
      UsersList.create!(user: new_user, list: other_list, has_accepted: nil)
    end

    it "returns lists not yet accepted by user" do
      expect(described_class.pending(new_user).count).to eq 1
    end
  end
end

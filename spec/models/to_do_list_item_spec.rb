# frozen_string_literal: true

require "rails_helper"

RSpec.describe ToDoListItem, type: :model do
  let(:item) { create :to_do_list_item, task: "foo" }
  let(:another_item) { create :to_do_list_item, task: "bar" }

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid when user is blank" do
      item.user = nil
      expect(item).to_not be_valid
    end

    it "is invalid when task is blank" do
      item.task = nil
      expect(item).to_not be_valid
    end

    it "is invalid when completed is blank" do
      item.completed = nil
      expect(item).to_not be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by created at" do
      expect(ToDoListItem.ordered).to eq [another_item, item]
    end
  end

  describe "#archive" do
    it "archives item" do
      expect(item.archived_at).to be_nil
      item.archive
      expect(item.archived_at).to_not be_nil
    end
  end
end

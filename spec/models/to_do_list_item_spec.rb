# frozen_string_literal: true

require "rails_helper"

RSpec.describe ToDoListItem, type: :model do
  let(:user) { create :user }
  let(:another_user) { create :user }
  let(:item) do
    create :to_do_list_item,
           due_by: Time.zone.now,
           assignee_id: user.id,
           task: "foo"
  end
  let(:another_item) do
    create :to_do_list_item,
           due_by: Time.zone.now,
           assignee_id: another_user.id,
           task: "bar"
  end
  let(:third_item) do
    create :to_do_list_item,
           due_by: Time.zone.now - 1,
           assignee_id: user.id,
           task: "bar"
  end

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid when user is blank" do
      item.user = nil
      expect(item).not_to be_valid
    end

    it "is invalid when task is blank" do
      item.task = nil
      expect(item).not_to be_valid
    end

    it "is invalid when completed is blank" do
      item.completed = nil
      expect(item).not_to be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by due by then assignee id then task" do
      expect(described_class.ordered).to eq [third_item, another_item, item]
    end
  end

  describe "#archive" do
    it "archives item" do
      expect(item.archived_at).to be_nil
      item.archive
      expect(item.archived_at).not_to be_nil
    end
  end
end

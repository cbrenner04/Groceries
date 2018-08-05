# frozen_string_literal: true

require "rails_helper"

RSpec.describe GroceryListItem do
  let(:item) { create :grocery_list_item, product: "foo" }
  let(:another_item) { create :grocery_list_item, product: "bar" }

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid without user" do
      item.user = nil

      expect(item).to_not be_valid
    end

    it "is invalid without product" do
      item.product = nil

      expect(item).to_not be_valid
    end

    it "is invalid without quantity" do
      item.quantity = nil

      expect(item).to_not be_valid
    end

    it "is invalid without purchased" do
      item.purchased = nil

      expect(item).to_not be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by product" do
      expect(GroceryListItem.ordered).to eq [another_item, item]
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

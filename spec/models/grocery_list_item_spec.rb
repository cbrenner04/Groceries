# frozen_string_literal: true

require "rails_helper"

RSpec.describe GroceryListItem do
  let(:item) { create :grocery_list_item, name: "foo" }
  let(:another_item) { create :grocery_list_item, name: "bar" }

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid without user" do
      item.user = nil

      expect(item).to_not be_valid
    end

    it "is invalid without name" do
      item.name = nil

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
    it "returns items ordered by name" do
      expect(GroceryListItem.ordered).to eq [another_item, item]
    end
  end

  describe ".unique_names" do
    let(:third_item) { create :grocery_list_item, name: "foo" }

    it "returns unique items based on name" do
      item
      another_item
      third_item
      item_names = GroceryListItem.unique_names.map(&:name)
      expect(item_names).to eq [another_item.name, item.name]
    end
  end
end

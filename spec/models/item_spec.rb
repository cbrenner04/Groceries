# frozen_string_literal: true
require "rails_helper"

RSpec.describe Item, type: :model do
  describe "validations" do
    let(:item) { create :item }

    it "is valid" do
      expect(item).to be_valid
    end

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
end

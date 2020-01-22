# frozen_string_literal: true

require "rails_helper"

RSpec.describe GroceryList do
  let(:user) { create :user }
  let(:list) { create :grocery_list, owner: user }
  let(:other_list) { create :grocery_list, owner: user }

  before do
    create :grocery_list_item, grocery_list: list, category: "foo"
    create :grocery_list_item, grocery_list: other_list, category: "bar"
  end

  describe ".categories" do
    it "returns categories for current list" do
      expect(list.categories).to include "foo"
      expect(list.categories).not_to include "bar"
    end
  end
end

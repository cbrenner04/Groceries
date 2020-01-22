# frozen_string_literal: true

require "rails_helper"

RSpec.describe BookList do
  let(:user) { create :user }
  let(:list) { create :book_list, owner: user }
  let(:other_list) { create :book_list, owner: user }

  before do
    create :book_list_item, book_list: list, category: "foo"
    create :book_list_item, book_list: other_list, category: "bar"
  end

  describe ".categories" do
    it "returns categories for current list" do
      expect(list.categories).to include "foo"
      expect(list.categories).not_to include "bar"
    end
  end
end

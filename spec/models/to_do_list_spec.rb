# frozen_string_literal: true

require "rails_helper"

RSpec.describe ToDoList do
  let(:user) { create :user }
  let(:list) { create :to_do_list, owner: user }
  let(:other_list) { create :to_do_list, owner: user }

  before do
    create :to_do_list_item, to_do_list: list, category: "foo"
    create :to_do_list_item, to_do_list: other_list, category: "bar"
  end

  describe ".categories" do
    it "returns categories for current list" do
      expect(list.categories).to include "foo"
      expect(list.categories).not_to include "bar"
    end
  end
end

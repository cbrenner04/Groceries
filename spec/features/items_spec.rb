# frozen_string_literal: true
require "rails_helper"

feature "Items" do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:list_page) { Pages::List.new }
  let(:item_page) { Pages::Item.new }

  before { sign_in user }

  describe "create" do
    before { list_page.load_list list }

    it "creates successfully" do
      list_page.add_item
      item_page.fill_in_name_with "bar"
      item_page.fill_in_quantity_with "20"
      item_page.submit

      list_page.load_list list

      expect(list_page).to have_item "20 bar"
    end
  end

  describe "update" do
    let(:item) { create :item, list: list, name: "bar", quantity: 10 }

    before { item_page.load_edit item, list }

    it "updates successfully" do
      item_page.fill_in_quantity_with "25"
      item_page.submit

      expect(list_page).to have_item "25 bar"
    end
  end

  describe "destroy" do
    before do
      create :item, list: list, name: "bar"
      list_page.load_list list
    end

    it "destroys successfully" do
      item_page.destroy_item "bar"

      expect(list_page).to_not have_text "bar"
    end
  end
end

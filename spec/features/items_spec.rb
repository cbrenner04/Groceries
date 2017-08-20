# frozen_string_literal: true

require "rails_helper"

feature "Items", :js do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:list_page) { Pages::List.new }
  let(:item_page) { Pages::Item.new }

  before do
    log_in_user user
    sleep 0.2
  end

  describe "create" do
    before do
      list_page.load_list list
      sleep 0.5
    end

    it "creates a new item successfully" do
      list_page.fill_in_new_item_quantity "20"
      list_page.fill_in_new_item_quantity_type "bags"
      list_page.fill_in_new_item_name "oranges"
      list_page.add_item

      expect(list_page).to have_item "20 bags oranges"
    end
  end

  describe "update" do
    let(:item) { create :item, list: list, name: "bar", quantity: 10 }

    before do
      item_page.load_edit(item, list)
      sleep 0.2
    end

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
      sleep 0.2
    end

    it "destroys successfully" do
      item_page.destroy_item "bar"

      expect(list_page).to_not have_text "bar"
    end
  end
end

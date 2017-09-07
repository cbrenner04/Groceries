# frozen_string_literal: true

require "rails_helper"

feature "Grocery List Items", :js do
  let(:user) { create :user }
  let(:list) { create :grocery_list }
  let(:users_list) { create :users_list, user: user, list: list }
  let(:list_page) { Pages::List.new }
  let(:item_page) { Pages::GroceryListItem.new }

  before do
    log_in_user user
    sleep 0.5
  end

  describe "create" do
    before { list_page.load_list list }

    # Capybara::Poltergeist::DeadClient no matter what I do
    it "creates a new item successfully" # do
    #   list_page.fill_in_new_item_quantity "20"
    #   list_page.fill_in_new_item_quantity_type "bags"
    #   list_page.fill_in_new_item_name "oranges"
    #   list_page.add_item

    #   expect(list_page).to have_item "20 bags oranges"
    # end
  end

  describe "update" do
    let(:item) do
      create :grocery_list_item, grocery_list: list, name: "bar", quantity: 10
    end

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

  describe "purchase" do
    it "purchases successfully"
  end

  describe "unpurchase" do
    it "unpurchases successfully"
  end

  describe "destroy" do
    before do
      create :grocery_list_item, list: list, name: "bar"
      list_page.load_list list
    end

    # Capybara::Poltergeist::DeadClient no matter what I do
    it "destroys successfully" # do
    #   item_page.destroy_item "bar"

    #   expect(list_page).to_not have_text "bar"
    # end
  end
end

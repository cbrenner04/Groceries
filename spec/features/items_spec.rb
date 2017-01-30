# frozen_string_literal: true
require "rails_helper"

feature "Items" do
  let(:user) { create :user }
  let(:list) { create :list, user: user }

  before { sign_in user }

  describe "create" do
    it "creates successfully" do
      list = create :list
      visit list_path(list)
      click_on "Add item to list"
      fill_in "Name", with: "bar"
      fill_in "Quantity", with: "20"
      click_on "Submit"

      expect(page).to have_css(".card", text: "20 bar")
    end
  end

  describe "update" do
    it "updates successfully" do
      list = create :list
      item = create :item, list: list, name: "bar", quantity: 10
      visit edit_item_path(item, list_id: list.id)
      fill_in "Quantity", with: "25"
      click_on "Submit"

      expect(page).to have_css(".card", text: "25 bar")
    end
  end

  describe "destroy" do
    it "destroys successfully" do
      list = create :list
      create :item, list: list, name: "bar"
      visit list_path(list)
      within(".card", text: "bar") do
        click_on "Destroy"
      end

      expect(page).to_not have_text "bar"
    end
  end
end

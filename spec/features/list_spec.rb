# frozen_string_literal: true
require "rails_helper"

feature "Lists" do
  let(:user) { create :user }

  before { sign_in user }

  describe "create" do
    it "creates list" do
      visit new_list_path
      fill_in "Name", with: "foo"
      click_on "Create List"

      expect(page).to have_css("li", text: "foo")
    end
  end

  describe "update" do
    it "updates list" do
      list = create :list
      visit list_path(list)
      click_on "Edit"
      fill_in "Name", with: "foo"
      click_on "Update List"

      expect(page).to have_css("h1", text: "foo")
    end
  end

  describe "destroy" do
    it "deletes list" do
      list = create :list, name: "foo"
      create :list, name: "bar"
      visit list_path(list)
      click_on "Destroy"

      expect(page).to have_text "bar"
      expect(page).to_not have_text "foo"
    end
  end
end

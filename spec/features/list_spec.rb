# frozen_string_literal: true
require "rails_helper"

feature "Lists" do
  let(:user) { create :user }

  before { sign_in user }

  describe "create" do
    it "creates list" do
      visit new_list_path
      fill_in "Name", with: "foo"
      click_on "Submit"

      expect(page).to have_css("h5", text: "foo")
    end
  end

  describe "index" do
    it "has most recent list at top" do
      create :list, name: "foo"
      create :list, name: "bar"
      visit lists_path

      expect(first(".list-group-item")).to have_text "bar"
    end
  end

  describe "update" do
    it "updates list" do
      list = create :list
      visit list_path(list)
      first("a", text: "Edit").click
      fill_in "Name", with: "foo"
      click_on "Submit"

      expect(page).to have_css("h1", text: "foo")
    end
  end

  describe "destroy" do
    it "deletes list with no items" do
      list = create :list, name: "foo"
      create :list, name: "bar"
      visit list_path(list)
      first("a", text: "Destroy").click

      expect(page).to have_text "bar"
      expect(page).to_not have_text "foo"
    end

    it "deletes list with items" do
      list = create :list, name: "foo"
      create :list, name: "bar"
      create :item, list: list
      visit list_path(list)
      first("a", text: "Destroy").click

      expect(page).to have_text "bar"
      expect(page).to_not have_text "foo"
    end
  end
end

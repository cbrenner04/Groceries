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

      expect(page).to have_text "name: \"foo\""
    end
  end
end

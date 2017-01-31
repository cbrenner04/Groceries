# frozen_string_literal: true
require "rails_helper"

feature "Lists" do
  let(:user) { create :user }
  let(:list_page) { Pages::List.new }

  before { sign_in user }

  describe "create" do
    it "creates list" do
      list_page.load_new
      list_page.fill_in_name_with "foo"
      list_page.submit

      expect(list_page).to have_list "foo"
    end
  end

  describe "index" do
    let(:another_user) { create :user }

    before do
      create :list, name: "foo", user: user
      create :list, name: "bar", user: user
      create :list, name: "baz", user: another_user
    end

    it "has most recent list at top" do
      list_page.load_index

      expect(list_page.first_list).to have_text "bar"
    end

    it "only show lists for logged in user" do
      list_page.load_index

      expect(list_page).to have_text "foo"
      expect(list_page).to_not have_text "baz"
    end
  end

  describe "update" do
    let(:list) { create :list, user: user }

    before { list_page.load_list list }

    it "updates list" do
      list_page.edit_list
      list_page.fill_in_name_with "foo"
      list_page.submit

      expect(list_page).to have_list_title "foo"
    end
  end

  describe "destroy" do
    let(:list) { create :list, name: "foo", user: user }

    context "when there are no items" do
      before do
        create :list, name: "bar", user: user
        list_page.load_list list
      end

      it "deletes list" do
        list_page.destroy_list

        expect(list_page).to have_text "bar"
        expect(list_page).to_not have_text "foo"
      end
    end

    context "where there are items" do
      before do
        create :list, name: "bar", user: user
        create :item, list: list
        list_page.load_list list
      end

      it "deletes list with items" do
        list_page.destroy_list

        expect(list_page).to have_text "bar"
        expect(list_page).to_not have_text "foo"
      end
    end
  end
end

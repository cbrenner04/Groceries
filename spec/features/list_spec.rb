# frozen_string_literal: true
require "rails_helper"

feature "Lists", :js do
  let(:user) { create :user_with_lists }
  let(:another_user) { create :user_with_lists }
  let(:first_list) { create :list, name: "foo" }
  let(:second_list) { create :list, name: "bar" }
  let(:third_list) { create :list, name: "baz" }
  let(:list_page) { Pages::List.new }

  before do
    [first_list, second_list].each { |list| user.lists << list }
    another_user.lists << third_list
    visit '/'
    fill_in "Email", with: user.email
    fill_in "Password", with: user.password
    click_on "Log in"
  end

  describe "create" do
    it "creates list" do
      save_and_open_page
      list_page.fill_in_name_with "foobar"
      list_page.submit

      expect(list_page).to have_list "foobar"
    end
  end

  describe "index" do
    it "has most recent list at top" do
      list_page.load_index

      expect(list_page.first_list).to have_text user.lists.last.name
    end

    it "only show lists for logged in user" do
      list_page.load_index

      expect(list_page).to have_text "foo"
      expect(list_page).to_not have_text "baz"
    end
  end

  describe "update" do
    let(:list) { user.lists.last }

    before { list_page.load_list list }

    it "updates list" do
      list_page.edit_list
      list_page.fill_in_name_with "updated"
      list_page.submit

      expect(list_page).to have_list_title "updated"
    end
  end

  describe "destroy" do
    let(:list) { user.lists.find_by(name: "foo") }

    context "when there are no items" do
      before { list_page.load_list list }

      it "deletes list" do
        list_page.destroy_list

        expect(list_page).to have_text "bar"
        expect(list_page).to_not have_text "foo"
      end
    end

    context "where there are items" do
      before do
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

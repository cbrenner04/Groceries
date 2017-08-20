# frozen_string_literal: true

require "rails_helper"

feature "Lists", :js do
  let(:user) { create :user_with_lists }
  let(:another_user) { create :user_with_lists }
  let!(:first_list) { create :list, name: "foo" }
  let!(:second_list) { create :list, name: "bar" }
  let!(:third_list) { create :list, name: "baz" }
  let!(:fourth) { create :list, name: "asdf" }
  let!(:fifth) { create :list, name: "xyz" }
  let(:list_page) { Pages::List.new }

  before do
    [first_list, second_list, fourth, fifth].each { |list| user.lists << list }
    another_user.lists << third_list
    log_in_user user
    sleep 0.2
  end

  describe "create" do
    it "creates list" do
      list_page.fill_in_name_with "foobar"
      list_page.create_list

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
    before { list_page.load_index }

    it "completes list" do
      sleep 0.2
      within(list_page.first_list) { list_page.complete_list }

      sleep 0.2 # HACK: keep it from throwing stale element reference
      expect(list_page.first_list).to have_text "Completed"
    end

    it "updates list" do
      list_page.edit_list(user.lists.last.name)
      list_page.fill_in_edit_name_with "updated"
      list_page.submit

      expect(list_page).to have_text "updated"
    end
  end

  describe "destroy" do
    context "when there are no items" do
      before { list_page.load_index }

      it "deletes list" do
        list_page.destroy_list("foo")

        expect(list_page).to have_text "bar"
        expect(list_page).to_not have_text "foo"
      end
    end

    context "where there are items" do
      let(:list) { List.find_by(name: "bar") }

      before do
        create :item, list: list
        list_page.load_index
      end

      it "deletes list with items" do
        list_page.destroy_list("bar")

        expect(list_page).to_not have_text "bar"
        expect(list_page).to have_text "xyz"
      end
    end
  end
end

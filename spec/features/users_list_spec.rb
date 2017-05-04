# frozen_string_literal: true

require "rails_helper"

feature "Users list", :js do
  let(:user) { create :user }
  let!(:list) { create :list, name: "foo" }
  let!(:users_list) { create :users_list, user: user, list: list }
  let!(:other_user) { create :user }
  let(:list_page) { Pages::List.new }
  let(:users_list_page) { Pages::UsersList.new }

  before { sign_in user }

  describe "create" do
    it "shares a list" do
      list_page.load_index
      list_page.share_list("foo")
      users_list_page.select_user(other_user.first_name)
      users_list_page.submit

      expect(list_page).to have_text "Your list was successfully shared"

      logout(user)
      sign_in other_user
      list_page.load_list(list)

      expect(list_page).to have_text "foo"
    end
  end
end

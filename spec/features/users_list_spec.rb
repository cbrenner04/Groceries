# frozen_string_literal: true
require "rails_helper"

feature "Users list" do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let!(:other_user) { create :user }
  let(:list_page) { Pages::List.new }
  let(:users_list_page) { Pages::UsersList.new }

  before { sign_in user }

  describe "create" do
    it "shares a list" do
      list_page.load_list(list)
      list_page.share_list
      users_list_page.select_user(other_user.first_name)
      users_list_page.submit

      expect(list_page).to have_text "Your list was successfully shared"

      logout(user)
      sign_in other_user
      list_page.load_list(list)

      expect(list_page).to have_text list.name
    end
  end
end

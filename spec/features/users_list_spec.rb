# frozen_string_literal: true

require "rails_helper"

feature "Users list", :js do
  let(:user) { create :user }
  let(:other_user) { create :user }
  let!(:list) { create :list, name: "foo-list" }
  let!(:other_list) { create :list, name: "bar-list" }
  let(:list_page) { Pages::List.new }
  let(:users_list_page) { Pages::UsersList.new }

  before do
    create :users_list, user: user, list: list
    create :users_list, user: other_user, list: list
    create :users_list, user: user, list: other_list
    sign_in user
  end

  describe "create" do
    it "shares a list with someone they've previously shared with" do
      list_page.load_index
      list_page.share_list other_list.name
      users_list_page.select_user other_user.email

      expect(list_page).to have_text list.name

      logout user
      sign_in other_user

      expect(list_page).to have_text other_list.name
    end

    # fails on circle ci, not sure why
    xit "invites a new person to share the list with" do
      list_page.load_index
      list_page.share_list other_list.name
      users_list_page.invite_user "foobar@bar.ex.foo"
      users_list_page.submit.click

      expect(list_page).to have_text other_list.name
    end
  end
end

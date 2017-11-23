# frozen_string_literal: true

require "rails_helper"

RSpec.feature "Users Lists", :js do
  let(:user) { create :user_with_lists }
  let(:users_lists_page) { Pages::UsersLists.new }

  before do
    log_in_user user
    visit "/lists/#{user.lists.first.id}/users_lists/new"
    wait_for { current_path == %r{\/lists\/\d+\/users_lists\/new} }
  end

  it "loads" do
    expect(users_lists_page.email_input).to be_present
    expect(users_lists_page.submit_button).to be_present
  end
end

# frozen_string_literal: true

require "rails_helper"

RSpec.feature "Lists", :js do
  let(:user) { create :user_with_lists }
  let(:lists_page) { Pages::Lists.new }

  before do
    user.lists.first.update!(completed: true)
    log_in_user user
  end

  it "loads and displays lists" do
    expect(lists_page.name_input).to be_present
    expect(lists_page.submit_button).to be_present
    expect(lists_page).to have_non_completed_list user.lists.last.name
    expect(lists_page).to have_completed_list user.lists.first.name
  end

  it "edit list" do
    visit "/lists/#{user.lists.first.id}/edit"
    wait_for { current_path == %r{\/lists\/\d+\/edit} }
    expect(lists_page.name_input).to be_present
    expect(lists_page.submit_button).to be_present
  end
end

# frozen_string_literal: true

require "rails_helper"

RSpec.feature "List", :js do
  let(:user) { create :user_with_lists }
  let!(:non_purchased_item) do
    create :grocery_list_item, grocery_list: user.lists.first, name: "foo"
  end
  let!(:purchased_item) do
    create :grocery_list_item,
           grocery_list: user.lists.first,
           name: "bar",
           purchased: true
  end
  let(:list_page) { Pages::List.new }

  before do
    log_in_user user
    visit "/lists/#{user.lists.first.id}"
    wait_for { current_path == %r{\/lists\/\d+} }
  end

  it "loads and displays items" do
    expect(list_page.name_input).to be_present
    expect(list_page.quantity_input).to be_present
    expect(list_page.quantity_name_input).to be_present
    expect(list_page.submit_button).to be_present
    expect(list_page).to have_non_purchased_item non_purchased_item.name
    expect(list_page).to have_purchased_item purchased_item.name
  end

  it "edit item page" do
    visit "/lists/#{user.lists.first.id}/grocery_list_items/" \
          "#{non_purchased_item.id}/edit"
    wait_for { current_path == %r{\/lists\/\d+\/grocery_list_items\/\d+\/edit} }
    expect(list_page.item_name_input).to be_present
    expect(list_page.item_quantity_input).to be_present
    expect(list_page.item_quantity_name_input).to be_present
    expect(list_page.submit_button).to be_present
  end
end

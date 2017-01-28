# frozen_string_literal: true
require "rails_helper"

feature "Home Page" do
  let(:user) { create :user }

  before { sign_in user }

  it "loads" do
    visit root_path

    expect(page).to have_text "Home"
  end
end

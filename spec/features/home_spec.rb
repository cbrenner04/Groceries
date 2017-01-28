# frozen_string_literal: true
require "rails_helper"

feature "Home Page" do
  it "loads" do
    visit root_path

    expect(status_code).to eq 200
  end
end

# frozen_string_literal: true

require "rails_helper"

RSpec.feature "Login", :js do
  let(:login_page) { Pages::Login.new }

  before { visit root_path }

  it "loads" do
    expect(login_page.email_input).to be_present
    expect(login_page.password_input).to be_present
    expect(login_page.submit_button).to be_present
  end

  it "forgot password" do
    click_on "Forgot your password?"
    expect(current_path).to eq "/users/password/new"
    expect(login_page.email_input).to be_present
    expect(login_page.submit_button).to be_present
  end

  it "sign up" do
    expect(login_page).to have_no_link "Sign up"
  end
end
